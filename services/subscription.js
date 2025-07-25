"use server";

import { prisma } from "@/lib/db";
import { getUserIdFromSession } from "@/lib/auth-utils";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";

export async function getSubscriptionDetails() {
	try {
		const userId = await getUserIdFromSession();

		if (!userId) {
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

		const userSubscriptions = await prisma.subscription.findMany({
			where: { userId },
		});

		if (!userSubscriptions.length) {
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

		const activeSubscription = userSubscriptions
			.filter((sub) => sub.status === "active")
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
			)[0];

		if (!activeSubscription) {
			const latestSubscription = userSubscriptions.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
			)[0];

			if (latestSubscription) {
				const now = new Date();
				const isExpired =
					new Date(latestSubscription.currentPeriodEnd) < now;
				const isCanceled = latestSubscription.status === "canceled";

				const result = {
					id: latestSubscription.id,
					productId: latestSubscription.productId,
					status: latestSubscription.status,
					amount: latestSubscription.amount,
					currency: latestSubscription.currency,
					recurringInterval: latestSubscription.recurringInterval,
					currentPeriodStart: latestSubscription.currentPeriodStart,
					currentPeriodEnd: latestSubscription.currentPeriodEnd,
					cancelAtPeriodEnd: latestSubscription.cancelAtPeriodEnd,
					canceledAt: latestSubscription.canceledAt,
					organizationId: null,
					blogEnabled: latestSubscription.blogEnabled,
					blogLimit: latestSubscription.blogLimit,
					portfolioLimit: latestSubscription.portfolioLimit,
					error: isCanceled
						? "Subscription has been canceled"
						: isExpired
							? "Subscription has expired"
							: "Subscription is not active",
					errorType: isCanceled
						? "CANCELED"
						: isExpired
							? "EXPIRED"
							: "GENERAL",
				};
				return result;
			}

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
			id: activeSubscription.id,
			productId: activeSubscription.productId,
			status: activeSubscription.status,
			amount: activeSubscription.amount,
			currency: activeSubscription.currency,
			recurringInterval: activeSubscription.recurringInterval,
			currentPeriodStart: activeSubscription.currentPeriodStart,
			currentPeriodEnd: activeSubscription.currentPeriodEnd,
			cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd,
			canceledAt: activeSubscription.canceledAt,
			organizationId: null,
			blogEnabled: activeSubscription.blogEnabled,
			blogLimit: activeSubscription.blogLimit,
			portfolioLimit: activeSubscription.portfolioLimit,
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

// Simple helper to check if user has an active subscription
export async function isUserSubscribed() {
	const result = await getSubscriptionDetails();
	return result.status === "active";
}

// Helper to check if user has access to a specific product/tier
export async function hasAccessToProduct(productId) {
	const result = await getSubscriptionDetails();
	return result.status === "active" && result.productId === productId;
}

// Helper to get user's current subscription status
// "active" | "canceled" | "expired" | "none"
export async function getUserSubscriptionStatus() {
	const result = await getSubscriptionDetails();

	if (!result) {
		return "none";
	}

	if (result.status === "active") {
		return "active";
	}

	if (result.errorType === "CANCELED") {
		return "canceled";
	}

	if (result.errorType === "EXPIRED") {
		return "expired";
	}

	return "none";
}
