"use server";

import { prisma } from "@/lib/db";
import { getUserIdFromSession } from "@/lib/auth-utils";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { polarClient } from "@/lib/auth";
import { logger } from "@/lib/utils";

export async function getUserLivePortfoliosCount(userId) {
	const count = await prisma.portfolio.count({
		where: { userId, isLive: true },
	});
	return count;
}

export async function getUserPublishedArticlesCount(userId) {
	const count = await prisma.blog.count({
		where: { userId, status: "published" },
	});
	return count;
}

export async function getSubscriptionDetails(userId) {
	try {
		// Fetch the user's subscription (one-to-one, so use findUnique)
		let userSubscription = await prisma.subscription.findUnique({
			where: { userId },
		});

		// If no subscription exists, create a free one
		if (!userSubscription) {
			await createFreeSubscription(userId);
			userSubscription = await prisma.subscription.findUnique({
				where: { userId },
			});
			// If still null (unlikely), log and throw
			if (!userSubscription) {
				logger.error("Failed to create free subscription for user", {
					userId,
				});
				throw new Error("Unable to create free subscription");
			}
		}

		// Return subscription details, mapping to desired output
		return {
			id: userSubscription.id,
			productId: userSubscription.productId ?? "free-product-id",
			status: userSubscription.status,
			amount: userSubscription.amount ?? 0,
			currency: userSubscription.currency ?? "usd",
			recurringInterval: userSubscription.recurringInterval ?? "monthly",
			currentPeriodStart:
				userSubscription.currentPeriodStart ?? new Date(),
			currentPeriodEnd:
				userSubscription.currentPeriodEnd ??
				new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			cancelAtPeriodEnd: userSubscription.cancelAtPeriodEnd,
			canceledAt: userSubscription.canceledAt,
			isFree: userSubscription.isFree,
			blogEnabled: userSubscription.blogEnabled,
			blogLimit: userSubscription.blogLimit ?? null,
			portfolioLimit: userSubscription.portfolioLimit,
			organizationId: null, // Kept for compatibility; remove if unused
		};
	} catch (error) {
		logger.error("Error fetching subscription details", { userId, error });
		throw new Error("Failed to load subscription details"); // Let caller handle
	}
}

export async function createFreeSubscription(userId) {
	logger.debug("Creating free subscription for user:", { userId });

	const plan = SUBSCRIPTION_PLANS.FREE.monthly;
	const now = new Date();
	const oneMonthLater = new Date(now);
	oneMonthLater.setMonth(now.getMonth() + 1);

	// Check for existing subscription (one-to-one)
	const existing = await prisma.subscription.findUnique({
		where: { userId },
	});

	// If there's an existing paid subscription, cancel it
	if (existing && !existing.isFree && existing.status === "active") {
		try {
			await prisma.subscription.update({
				where: { id: existing.id },
				data: {
					status: "canceled",
					canceledAt: now,
					updatedAt: now,
					lastEventType: "subscription.canceled",
					lastEventAt: now,
				},
			});
			logger.info(
				`Canceled existing paid subscription ${existing.id} for user ${userId}`
			);
		} catch (error) {
			logger.error(
				`Failed to cancel existing subscription ${existing.id}:`,
				error
			);
			throw error; // Rollback transaction
		}
	}

	// Build free subscription data using existing function for consistency
	const subscriptionData = buildSubscriptionData(
		{
			id: existing?.id || crypto.randomUUID(), // Reuse existing ID or generate new
			created_at: now.toISOString(),
			modified_at: now.toISOString(),
			amount: 0,
			currency: "usd",
			recurring_interval: plan.interval,
			status: "active",
			current_period_start: now.toISOString(),
			current_period_end: oneMonthLater.toISOString(),
			cancel_at_period_end: false,
			customer_id: userId, // Use userId as customerId for free plans
			product_id: plan.priceId || "free-product-id",
			discount_id: null,
			customer_cancellation_reason: null,
			customer_cancellation_comment: null,
			metadata: null,
			custom_field_data: null,
		},
		userId
	);

	// Add free-specific fields
	subscriptionData.isFree = true;
	subscriptionData.lastEventType = "subscription.free_created";
	subscriptionData.lastEventAt = now;
	subscriptionData.portfolioLimit = plan.portfolioLimit;
	subscriptionData.blogEnabled = plan.blogEnabled;
	subscriptionData.blogLimit = plan.blogLimit || null;
	subscriptionData.customPortfolioLimit = null;
	subscriptionData.customArticleLimit = null;

	// Upsert to handle both create and update cases (idempotent)
	await prisma.subscription.upsert({
		where: { userId }, // Enforces one-to-one
		update: { ...subscriptionData, id: subscriptionData.id }, // Ensure ID is preserved
		create: { ...subscriptionData },
	});

	logger.info(`✅ Created/Updated free subscription for user ${userId}`);
}

export async function createCheckoutSession({ userId, email, products }) {
	try {
		if (!userId || !email || !products.length > 0) {
			throw new Error(
				"User ID, user email and products are required",
				400,
				"MISSING_PARAMS"
			);
		}

		const checkoutSession = await polarClient.checkouts.create({
			customerExternalId: userId,
			products,
			customerEmail: email,
			successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=billing&success=true`,
		});

		return {
			success: true,
			data: { checkoutSession },
			message: "Checkout session created successfully",
		};
	} catch (error) {
		logger.error("Failed to create checkout session:", error);
		return { error: error.message || "Failed to create checkout session" };
	}
}

export async function cancelSubscription({ subscriptionId }) {
	try {
		if (!subscriptionId) {
			throw new Error("Subscription ID is required", 400);
		}

		const result = await polarClient.subscriptions.revoke({
			id: subscriptionId,
		});

		return {
			success: true,
			data: result,
			message: "Subscription cancelled successfully",
		};
	} catch (error) {
		logger.error("Failed to cancel subscription:", error);
		return { error: error.message || "Failed to cancel subscription" };
	}
}

export async function processSubscriptionEvent(tx, eventType, data, userId) {
	logger.debug("Processing event:", {
		eventType,
		subscriptionId: data.id,
		userId,
	});

	// Handle existing subscription for create/active
	if (
		eventType === "subscription.created" ||
		eventType === "subscription.active"
	) {
		await handleExistingSubscription(tx, data.id, userId);
	}

	// Build data with plan-specific fields
	const subscriptionData = buildSubscriptionData(data, userId);
	subscriptionData.lastEventType = eventType;
	subscriptionData.lastEventAt = new Date();

	// Upsert subscription
	await upsertSubscription(tx, data.id, subscriptionData, userId);

	// Handle side effects
	await handleEventSideEffects(eventType, data, userId);

	logger.info(`✅ Processed ${eventType} for ${data.id}`);
}

// Simplified: Check for one existing, cancel if not the new one
async function handleExistingSubscription(tx, newSubscriptionId, userId) {
	const existing = await tx.subscription.findUnique({ where: { userId } }); // Since one-to-one
	if (existing && existing.id !== newSubscriptionId && !existing.isFree) {
		try {
			await cancelSubscription({ subscriptionId: existing.id });
			await tx.subscription.update({
				where: { id: existing.id },
				data: {
					status: "canceled",
					canceledAt: new Date(),
					updatedAt: new Date(),
				},
			});
			logger.info(`Canceled existing ${existing.id} for ${userId}`);
		} catch (error) {
			logger.error(`Failed to cancel ${existing.id}:`, error);
			// Rollback transaction on failure
			throw error;
		}
	}
}

// Build data (unchanged, but with safe defaults)
function buildSubscriptionData(data, userId) {
	// Lookup plan based on product_id (default to FREE if missing/invalid)
	const planKey =
		data.product_id && SUBSCRIPTION_PLANS[data.product_id.split("-")[0]]
			? data.product_id.split("-")[0]
			: "FREE";
	const plan =
		SUBSCRIPTION_PLANS[planKey]?.monthly || SUBSCRIPTION_PLANS.FREE.monthly;

	return {
		createdAt: safeParseDate(data.created_at) || new Date(),
		updatedAt: safeParseDate(data.modified_at) || new Date(),
		amount: data.amount ?? 0,
		currency: data.currency ?? "usd",
		recurringInterval:
			data.recurring_interval || plan.interval || "monthly",
		status: data.status,
		currentPeriodStart: safeParseDate(data.current_period_start),
		currentPeriodEnd: safeParseDate(data.current_period_end),
		cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
		canceledAt: safeParseDate(data.canceled_at),
		startedAt: safeParseDate(data.started_at),
		endsAt: safeParseDate(data.ends_at),
		endedAt: safeParseDate(data.ended_at),
		customerId: data.customer_id,
		productId: data.product_id ?? plan.priceId ?? "free-product-id",
		discountId: data.discount_id ?? null,
		customerCancellationReason: data.customer_cancellation_reason ?? null,
		customerCancellationComment: data.customer_cancellation_comment ?? null,
		metadata: data.metadata ? JSON.stringify(data.metadata) : null,
		customFieldData: data.custom_field_data
			? JSON.stringify(data.custom_field_data)
			: null,
		userId: userId,
		isFree: data.product_id ? false : true, // Free if no product_id
		portfolioLimit: plan.portfolioLimit ?? 1,
		blogEnabled: plan.blogEnabled ?? false,
		blogLimit: plan.blogLimit ?? null,
		customPortfolioLimit: null, // Not in plan; kept for flexibility
		customArticleLimit: null, // Not in plan; kept for flexibility
	};
}

// Upsert (unchanged)
async function upsertSubscription(
	tx,
	subscriptionId,
	subscriptionData,
	userId
) {
	logger.debug("Upserting:", {
		id: subscriptionId,
		status: subscriptionData.status,
		userId,
	});
	await tx.subscription.upsert({
		where: { id: subscriptionId },
		update: subscriptionData,
		create: { id: subscriptionId, ...subscriptionData },
	});
	logger.debug("✅ Upserted:", subscriptionId);
}

// Side effects (unchanged)
async function handleEventSideEffects(eventType, data, userId) {
	switch (eventType) {
		case "subscription.canceled":
		case "subscription.revoked":
			logger.info(
				`Creating free subscription after ${eventType} for ${userId}`
			);
			await createFreeSubscription(userId); // Assume this upserts a free sub with generated ID, isFree: true
			break;
		case "subscription.active":
			logger.info(`Activated for ${userId}`);
			// await sendWelcomeEmail(userId);
			break;
		case "subscription.updated":
			logger.info(`Updated for ${userId}`);
			break;
		default:
			break;
	}
}

// Helper function for safe date parsing (from your original code)
function safeParseDate(dateString) {
	if (!dateString) return null;
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
}
