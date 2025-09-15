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

/**
 * Create a new active FREE subscription for the given userId.
 * This is used on user creation and on subscription cancellation.
 */
export async function createFreeSubscription(userId) {
	const plan = SUBSCRIPTION_PLANS.FREE.monthly;
	const now = new Date();
	const oneMonthLater = new Date(now);
	oneMonthLater.setMonth(now.getMonth() + 1);

	// Cancel all existing active subscriptions for this user
	await prisma.subscription.updateMany({
		where: {
			userId,
			status: "active",
		},
		data: {
			status: "canceled",
			canceledAt: now,
		},
	});

	return prisma.subscription.create({
		data: {
			userId,
			amount: 0,
			currency: "usd",
			recurringInterval: plan.interval,
			status: "active",
			currentPeriodStart: now,
			currentPeriodEnd: oneMonthLater,
			cancelAtPeriodEnd: false,
			canceledAt: null,
			startedAt: now,
			endsAt: null,
			endedAt: null,
			customerId: userId, // For free plan, use userId as customerId
			productId: plan.priceId || "free-product-id",
			discountId: null,
			checkoutId: "free-checkout",
			customerCancellationReason: null,
			customerCancellationComment: null,
			metadata: null,
			customFieldData: null,
			portfolioLimit: plan.portfolioLimit,
			blogEnabled: plan.blogEnabled,
			blogLimit: plan.blogLimit || null,
			customPortfolioLimit: null,
			customArticleLimit: null,
		},
	});
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
