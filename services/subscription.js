"use server";

import { prisma } from "@/lib/db";
import { getUserIdFromSession } from "@/lib/auth-utils";
import {
	canCreateBlogArticle,
	canCreatePortfolio,
	getUserBlogLimit,
	getUserPortfolioLimit,
	SUBSCRIPTION_PLANS,
} from "@/utils/subscription-plans";
import { polarClient } from "@/lib/auth";
import { logger } from "@/lib/utils";

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

export async function createCheckoutSession({ userId, email, priceId }) {
	try {
		if (!userId || !email || !priceId) {
			throw new Error(
				"User ID, user email and Price ID are required",
				400,
				"MISSING_PARAMS"
			);
		}

		const checkoutSession = await polarClient.checkouts.create({
			customerExternalId: userId,
			products: [priceId],
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

/**
 * Check if user can create a new portfolio
 */
export async function checkPortfolioCreationAuth(userId) {
	try {
		const subscription = await getSubscriptionDetails();

		if (subscription.error) {
			return {
				allowed: false,
				reason: subscription?.error || "No active subscription",
			};
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				portfolios: {
					where: { isLive: true },
					select: { id: true },
				},
			},
		});

		const currentLivePortfolioCount = user?.portfolios?.length || 0;
		const canCreate = canCreatePortfolio(
			subscription,
			currentLivePortfolioCount
		);

		return {
			allowed: canCreate,
			reason: canCreate ? null : "Portfolio limit reached",
			details: {
				current: currentLivePortfolioCount,
				limit: getUserPortfolioLimit(subscription),
				remaining: Math.max(
					0,
					getUserPortfolioLimit(subscription) -
						currentLivePortfolioCount
				),
			},
		};
	} catch (error) {
		logger.error("Error checking portfolio creation auth:", error);
		return { allowed: false, reason: "Authorization check failed" };
	}
}

/**
 * Check if user can create a new blog article
 */
export async function checkBlogArticleCreationAuth(userId) {
	try {
		const subscription = await getSubscriptionDetails();

		if (subscription.error) {
			return {
				allowed: false,
				reason: subscription?.error || "No active subscription",
			};
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				blogs: {
					where: { status: "published" },
					select: { id: true },
				},
			},
		});

		const currentArticleCount = user?.blogs?.length || 0;
		const canCreate = canCreateBlogArticle(
			subscription,
			currentArticleCount
		);

		return {
			allowed: canCreate,
			reason: canCreate ? null : "Blog article limit reached",
			details: {
				current: currentArticleCount,
				limit: getUserBlogLimit(subscription),
				remaining:
					getUserBlogLimit(subscription) === -1
						? -1
						: Math.max(
								0,
								getUserBlogLimit(subscription) -
									currentArticleCount
							),
			},
		};
	} catch (error) {
		logger.error("Error checking blog article creation auth:", error);
		return { allowed: false, reason: "Authorization check failed" };
	}
}

/**
 * Check if user can enable blog for a portfolio
 */
export async function checkBlogEnableAuth() {
	try {
		const subscription = await getSubscriptionDetails();

		if (subscription.error) {
			return {
				allowed: false,
				reason: subscription?.error || "No active subscription",
			};
		}

		const blogEnabled = subscription.blogEnabled;

		return {
			allowed: blogEnabled,
			reason: blogEnabled
				? null
				: "Blog feature not available in current plan",
			details: {
				blogEnabled: blogEnabled,
				plan: subscription.productId,
			},
		};
	} catch (error) {
		logger.error("Error checking blog enable auth:", error);
		return { allowed: false, reason: "Authorization check failed" };
	}
}

/**
 * Check if user can make portfolio live
 */
export async function checkPortfolioLiveAuth(userId) {
	try {
		const subscription = await getSubscriptionDetails();

		if (subscription.error) {
			return {
				allowed: false,
				reason: subscription?.error || "No active subscription",
			};
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				portfolios: {
					where: { isLive: true },
					select: { id: true },
				},
			},
		});

		const currentLivePortfolios = user?.portfolios?.length || 0;
		const canMakeLive = canCreatePortfolio(
			subscription,
			currentLivePortfolios
		);

		return {
			allowed: canMakeLive,
			reason: canMakeLive ? null : "Portfolio limit reached",
			details: {
				current: currentLivePortfolios,
				limit: getUserPortfolioLimit(subscription),
				remaining: Math.max(
					0,
					getUserPortfolioLimit(subscription) - currentLivePortfolios
				),
			},
		};
	} catch (error) {
		logger.error("Error checking portfolio live auth:", error);
		return { allowed: false, reason: "Authorization check failed" };
	}
}
