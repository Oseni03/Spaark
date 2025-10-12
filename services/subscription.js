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
		const userSubscription = await prisma.subscription.findFirst({
			where: {
				userId,
				status: "active" /* or your active status */,
			},
		});

		if (!userSubscription) {
			const plan = SUBSCRIPTION_PLANS.FREE.monthly;
			const now = new Date();
			const oneMonthLater = new Date(now);
			oneMonthLater.setMonth(now.getMonth() + 1);
			return {
				id: "free-subscription",
				productId: plan.priceId || "free-product-id",
				status: "active",
				amount: 0,
				currency: "usd",
				recurringInterval: plan.interval,
				currentPeriodStart: now,
				currentPeriodEnd: oneMonthLater,
				cancelAtPeriodEnd: false,
				canceledAt: null,
				organizationId: null,
				blogEnabled: plan.blogEnabled,
				blogLimit: plan.blogLimit || null,
				portfolioLimit: plan.portfolioLimit,
			};
		}

		return {
			id: userSubscription.id,
			productId: userSubscription.productId,
			status: userSubscription.status,
			amount: userSubscription.amount,
			currency: userSubscription.currency,
			recurringInterval: userSubscription.recurringInterval,
			currentPeriodStart: userSubscription.currentPeriodStart,
			currentPeriodEnd: userSubscription.currentPeriodEnd,
			cancelAtPeriodEnd: userSubscription.cancelAtPeriodEnd,
			canceledAt: userSubscription.canceledAt,
			organizationId: null,
			blogEnabled: userSubscription.blogEnabled,
			blogLimit: userSubscription.blogLimit,
			portfolioLimit: userSubscription.portfolioLimit,
		};
	} catch (error) {
		console.error("Error fetching subscription details:", error);
		const plan = SUBSCRIPTION_PLANS.FREE.monthly;
		const now = new Date();
		const oneMonthLater = new Date(now);
		oneMonthLater.setMonth(now.getMonth() + 1);
		return {
			id: "free-subscription",
			productId: plan.priceId || "free-product-id",
			status: "active",
			amount: 0,
			currency: "usd",
			recurringInterval: plan.interval,
			currentPeriodStart: now,
			currentPeriodEnd: oneMonthLater,
			cancelAtPeriodEnd: false,
			canceledAt: null,
			organizationId: null,
			blogEnabled: plan.blogEnabled,
			blogLimit: plan.blogLimit || null,
			portfolioLimit: plan.portfolioLimit,
			error: "Failed to load subscription details",
			errorType: "GENERAL",
		};
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

	// STEP 1: Handle existing subscription (simplified: at most one)
	if (
		eventType === "subscription.created" ||
		eventType === "subscription.active"
	) {
		await handleExistingSubscription(tx, data.id, userId); // Now handles single existing
	}

	// STEP 2: Build data (added isFree: false for paid)
	const subscriptionData = buildSubscriptionData(data, userId);
	subscriptionData.isFree = false;
	subscriptionData.lastEventType = eventType;
	subscriptionData.lastEventAt = new Date();

	// STEP 3: Upsert (DB unique enforces one-to-one)
	await upsertSubscription(tx, data.id, subscriptionData, userId);

	// STEP 4: Side effects (unchanged, but async if possible)
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
	return {
		createdAt: safeParseDate(data.created_at) || new Date(),
		updatedAt: safeParseDate(data.modified_at) || new Date(),
		amount: data.amount ?? 0,
		currency: data.currency ?? "USD",
		recurringInterval: data.recurring_interval || "monthly",
		status: data.status,
		currentPeriodStart: safeParseDate(data.current_period_start),
		currentPeriodEnd: safeParseDate(data.current_period_end),
		cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
		canceledAt: safeParseDate(data.canceled_at),
		startedAt: safeParseDate(data.started_at),
		endsAt: safeParseDate(data.ends_at),
		endedAt: safeParseDate(data.ended_at),
		customerId: data.customer_id,
		productId: data.product_id,
		discountId: data.discount_id ?? null,
		customerCancellationReason: data.customer_cancellation_reason ?? null,
		customerCancellationComment: data.customer_cancellation_comment ?? null,
		metadata: data.metadata ? JSON.stringify(data.metadata) : null,
		customFieldData: data.custom_field_data
			? JSON.stringify(data.custom_field_data)
			: null,
		userId: userId,
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
