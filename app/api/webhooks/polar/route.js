import { NextResponse } from "next/server";
import {
	validateEvent,
	WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { prisma } from "@/lib/db";
import { createFreeSubscription } from "@/services/subscription";
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
				const userId = data.customer?.externalId;

				// STEP 2: Build subscription data
				const subscriptionData = {
					createdAt: new Date(data.createdAt),
					updatedAt: safeParseDate(data.modifiedAt) || new Date(),
					amount: data.amount,
					currency: data.currency,
					recurringInterval: data.recurringInterval,
					status: data.status,
					currentPeriodStart:
						safeParseDate(data.currentPeriodStart) || new Date(),
					currentPeriodEnd:
						safeParseDate(data.currentPeriodEnd) || new Date(),
					cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
					canceledAt: safeParseDate(data.canceledAt),
					startedAt: safeParseDate(data.startedAt) || new Date(),
					endsAt: safeParseDate(data.endsAt),
					endedAt: safeParseDate(data.endedAt),
					customerId: data.customerId,
					productId: data.productId,
					discountId: data.discountId || null,
					checkoutId: data.checkoutId || "",
					customerCancellationReason:
						data.customerCancellationReason || null,
					customerCancellationComment:
						data.customerCancellationComment || null,
					metadata: data.metadata
						? JSON.stringify(data.metadata)
						: null,
					customFieldData: data.customFieldData
						? JSON.stringify(data.customFieldData)
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
				await prisma.subscription.upsert({
					where: { id: data.id },
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
			logger.error("❌ Webhook verification failed:", error);
			return new NextResponse("Unauthorized", { status: 403 });
		}

		logger.error("💥 Unexpected error in webhook handler:", error);
		throw error;
	}
}

// Disable body parsing for webhooks
export const runtime = "nodejs";
