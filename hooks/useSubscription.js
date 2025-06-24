import { useAuth } from "@/context/auth-context";
import {
	canCreatePortfolio,
	canCreateBlogArticle,
	hasPremiumFeatures,
	hasAnalyticsAccess,
	getUserPortfolioLimit,
	getUserBlogLimit,
	isInTrialPeriod,
} from "@/utils/subscription-plans";
import { useState, useEffect } from "react";
import { prisma } from "@/lib/db";

export function useSubscription() {
	const { user } = useAuth();
	const [usage, setUsage] = useState({
		portfolios: { current: 0, limit: 0 }, // current = live portfolios only
		articles: { current: 0, limit: 0 }, // current = published articles only
	});

	const subscription = user?.subscription;

	// Fetch usage data
	useEffect(() => {
		if (subscription?.status === "active") {
			fetchUsage();
		}
	}, [subscription]);

	const fetchUsage = async () => {
		try {
			const user = await prisma.user.findUnique({
				where: { id: user.id },
				include: {
					subscription: true,
					portfolios: {
						where: { isLive: true },
						select: {
							id: true,
							isLive: true,
						},
					},
					blogs: {
						where: { status: "published" },
						select: {
							id: true,
							status: true,
						},
					},
				},
			});

			if (!user) {
				return new NextResponse("User not found", { status: 404 });
			}

			// Calculate current usage - only count live portfolios and published articles
			const activePortfolios = user.portfolios.length; // Already filtered to live only
			const publishedArticles = user.blogs.length; // Already filtered to published only

			const subscriptionData = {
				...user.subscription,
				usage: {
					portfolios: {
						current: activePortfolios,
						limit:
							user.subscription?.customPortfolioLimit ||
							user.subscription?.portfolioLimit ||
							0,
					},
					articles: {
						current: publishedArticles,
						limit: user.subscription?.blogLimit || 0,
					},
				},
			};
			setUsage(
				subscriptionData.usage || {
					portfolios: { current: 0, limit: 0 },
					articles: { current: 0, limit: 0 },
				}
			);
		} catch (error) {
			console.error("Error fetching usage:", error);
		}
	};

	// Permission checks - based on live portfolios and published articles
	const canCreateNewPortfolio = canCreatePortfolio(
		subscription,
		usage.portfolios.current // live portfolios count
	);
	const canCreateNewBlogArticle = canCreateBlogArticle(
		subscription,
		usage.articles.current // published articles count
	);
	const hasPremium = hasPremiumFeatures(subscription);
	const hasAnalytics = hasAnalyticsAccess(subscription);
	const inTrial = isInTrialPeriod(subscription);

	// Limits
	const portfolioLimit = getUserPortfolioLimit(subscription);
	const blogLimit = getUserBlogLimit(subscription);

	// Status checks
	const isSubscribed = subscription?.status === "active";
	const isPending = subscription?.status === "pending";
	const isCancelled = subscription?.status === "cancelled";

	return {
		// Subscription data
		subscription,
		isSubscribed,
		isPending,
		isCancelled,
		inTrial,

		// Usage data (live portfolios and published articles only)
		usage,
		refreshUsage: fetchUsage,

		// Limits
		portfolioLimit,
		blogLimit,

		// Permissions
		canCreateNewPortfolio,
		canCreateNewBlogArticle,
		hasPremium,
		hasAnalytics,

		// Helper functions
		getRemainingPortfolios: () =>
			Math.max(0, portfolioLimit - usage.portfolios.current),
		getRemainingArticles: () =>
			blogLimit === -1
				? -1
				: Math.max(0, blogLimit - usage.articles.current),
	};
}
