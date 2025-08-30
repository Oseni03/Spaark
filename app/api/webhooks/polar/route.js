import { NextResponse } from "next/server";
import {
	validateEvent,
	WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { prisma } from "@/lib/db";
import {
	cancelSubscription,
	createFreeSubscription,
} from "@/services/subscription";
import { logger } from "@/lib/utils";

// Utility function to safely parse dates
function safeParseDate(dateString) {
	if (!dateString) return null;
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
}

export async function POST(req) {
	try {
		// Get raw body and headers
		const body = await req.text();
		const headers = Object.fromEntries(req.headers.entries());

		// Validate the webhook event
		const event = validateEvent(
			body,
			headers,
			process.env.POLAR_WEBHOOK_SECRET ??
				(() => {
					throw new Error(
						"POLAR_WEBHOOK_SECRET environment variable is required"
					);
				})()
		);

		// Parse the validated payload
		const payload = JSON.parse(body);
		const { data, type } = payload;

		// Process subscription-related events
		if (
			type === "subscription.created" ||
			type === "subscription.active" ||
			type === "subscription.canceled" ||
			type === "subscription.revoked" ||
			type === "subscription.uncanceled" ||
			type === "subscription.updated"
		) {
			logger.debug("🎯 Processing subscription webhook:", type);
			logger.debug("📦 Payload data:", JSON.stringify(data, null, 2));

			try {
				// Validate webhook data
				if (!data || typeof data !== "object") {
					logger.error("💥 Invalid webhook data received:", data);
					return new NextResponse("Invalid webhook data", {
						status: 400,
					});
				}

				// STEP 1: Extract user ID from customer data
				const userId = data.customer?.external_id;

				// Find existing active subscriptions in Polar
				// Add a 5-minute buffer to prevent cancelling very recent subscriptions
				const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

				const existingSubscriptions =
					await prisma.subscription.findMany({
						where: {
							userId: userId,
							status: "active",
							id: { not: data.id }, // Exclude the new subscription
							createdAt: {
								lt: fiveMinutesAgo, // Only consider subscriptions older than 5 minutes
							},
						},
					});

				// Cancel existing subscriptions in Polar
				for (const subscription of existingSubscriptions) {
					await cancelSubscription({
						subscriptionId: subscription.id,
					});
					logger.info(
						`🔔 Canceled existing subscription ${subscription.id} for user ${userId}`
					);
				}

				// STEP 2: Build subscription data
				const subscriptionData = {
					createdAt: safeParseDate(data.created_at) || new Date(),
					updatedAt: safeParseDate(data.modified_at) || new Date(),
					amount: data.amount,
					currency: data.currency,
					recurringInterval: data.recurring_interval || "monthly",
					status: data.status,
					currentPeriodStart:
						safeParseDate(data.current_period_start) || new Date(),
					currentPeriodEnd: safeParseDate(data.current_period_end),
					cancelAtPeriodEnd: data.cancel_at_period_end || false,
					canceledAt: safeParseDate(data.canceled_at),
					startedAt: safeParseDate(data.started_at),
					endsAt: safeParseDate(data.ends_at),
					endedAt: safeParseDate(data.ended_at),
					customerId: data.customer_id,
					productId: data.product_id,
					discountId: data.discount_id || null,
					checkoutId: data.checkout_id || "",
					customerCancellationReason:
						data.customer_cancellation_reason || null,
					customerCancellationComment:
						data.customer_cancellation_comment || null,
					metadata: data.metadata
						? JSON.stringify(data.metadata)
						: null,
					customFieldData: data.custom_field_data
						? JSON.stringify(data.custom_field_data)
						: null,
					userId: userId,
				};

				logger.debug("💾 Final subscription data:", {
					id: data.id,
					status: subscriptionData.status,
					userId: subscriptionData.userId,
					amount: subscriptionData.amount,
				});

				// STEP 3: Use Prisma's upsert for proper upsert
				if (!data.id) {
					logger.error(
						"💥 Missing required ID for subscription upsert:",
						{ id: data.id }
					);
					return new NextResponse("Missing subscription ID", {
						status: 400,
					});
				}

				await prisma.subscription.upsert({
					where: { id: data.id, userId: userId },
					update: { ...subscriptionData },
					create: {
						id: data.id,
						...subscriptionData,
					},
				});

				// Automatically subscribe user to FREE plan on cancellation
				if (type === "subscription.canceled" && userId) {
					await createFreeSubscription(userId);
				}

				logger.debug("✅ Upserted subscription:", data.id);
			} catch (error) {
				logger.error(
					"💥 Error processing subscription webhook:",
					error
				);
				// Don't throw - let webhook succeed to avoid retries
			}
		}

		// Return success response
		return new NextResponse("", { status: 202 });
	} catch (error) {
		if (error instanceof WebhookVerificationError) {
			logger.error("⌛ Webhook verification failed:", error);
			return new NextResponse("Unauthorized", { status: 403 });
		}

		logger.error("💥 Unexpected error in webhook handler:", error);
		throw error;
	}
}

// Disable body parsing for webhooks
export const runtime = "nodejs";
