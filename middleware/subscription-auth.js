import { prisma } from "@/lib/db";
import { logger } from "@/lib/utils";
import {
	getSubscriptionDetails,
	isUserSubscribed,
} from "@/services/subscription";
import {
	canCreatePortfolio,
	canCreateBlogArticle,
	getUserPortfolioLimit,
	getUserBlogLimit,
} from "@/utils/subscription-plans";

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
