import { prisma } from "@/lib/db";
import { logger } from "@/lib/utils";
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
		// Get user with subscription and live portfolio count
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				subscription: true,
				portfolios: {
					where: { isLive: true },
					select: { id: true },
				},
			},
		});

		if (!user) {
			return { allowed: false, reason: "User not found" };
		}

		if (!user.subscription || user.subscription.status !== "active") {
			return { allowed: false, reason: "No active subscription" };
		}

		const currentLivePortfolioCount = user.portfolios.length;
		const canCreate = canCreatePortfolio(
			user.subscription,
			currentLivePortfolioCount
		);

		return {
			allowed: canCreate,
			reason: canCreate ? null : "Portfolio limit reached",
			details: {
				current: currentLivePortfolioCount,
				limit: getUserPortfolioLimit(user.subscription),
				remaining: Math.max(
					0,
					getUserPortfolioLimit(user.subscription) -
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
		// Get user with subscription and blog count
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				subscription: true,
				blogs: {
					where: { status: "published" },
					select: { id: true },
				},
			},
		});

		if (!user) {
			return { allowed: false, reason: "User not found" };
		}

		if (!user.subscription || user.subscription.status !== "active") {
			return { allowed: false, reason: "No active subscription" };
		}

		const currentArticleCount = user.blogs.length;
		const canCreate = canCreateBlogArticle(
			user.subscription,
			currentArticleCount
		);

		return {
			allowed: canCreate,
			reason: canCreate ? null : "Blog article limit reached",
			details: {
				current: currentArticleCount,
				limit: getUserBlogLimit(user.subscription),
				remaining:
					getUserBlogLimit(user.subscription) === -1
						? -1
						: Math.max(
								0,
								getUserBlogLimit(user.subscription) -
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
export async function checkBlogEnableAuth(userId) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				subscription: true,
			},
		});

		if (!user) {
			return { allowed: false, reason: "User not found" };
		}

		if (!user.subscription || user.subscription.status !== "active") {
			return { allowed: false, reason: "No active subscription" };
		}

		const blogEnabled = user.subscription.blogEnabled;

		return {
			allowed: blogEnabled,
			reason: blogEnabled
				? null
				: "Blog feature not available in current plan",
			details: {
				blogEnabled: blogEnabled,
				plan: user.subscription.type,
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
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				subscription: true,
				portfolios: {
					where: { isLive: true },
					select: { id: true },
				},
			},
		});

		if (!user) {
			return { allowed: false, reason: "User not found" };
		}

		if (!user.subscription || user.subscription.status !== "active") {
			return { allowed: false, reason: "No active subscription" };
		}

		const currentLivePortfolios = user.portfolios.length;
		const canMakeLive = canCreatePortfolio(
			user.subscription,
			currentLivePortfolios
		);

		return {
			allowed: canMakeLive,
			reason: canMakeLive ? null : "Portfolio limit reached",
			details: {
				current: currentLivePortfolios,
				limit: getUserPortfolioLimit(user.subscription),
				remaining: Math.max(
					0,
					getUserPortfolioLimit(user.subscription) -
						currentLivePortfolios
				),
			},
		};
	} catch (error) {
		logger.error("Error checking portfolio live auth:", error);
		return { allowed: false, reason: "Authorization check failed" };
	}
}
