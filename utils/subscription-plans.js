import { logger } from "@/lib/utils";

export const SUBSCRIPTION_PLANS = {
	FREE: {
		monthly: {
			price: 0,
			priceId: process.env.NEXT_PUBLIC_MONTHLY_FREE_PRICE_ID,
			interval: "month",
			trial: true,
			features: [
				"1 active portfolio",
				"Free template selection",
				"Project showcase",
				"Skills visualization",
				"Contact form",
			],
			portfolioLimit: 1,
			blogEnabled: false,
			slug: "free",
		},
	},
	BASIC: {
		monthly: {
			price: 9.99,
			priceId: process.env.NEXT_PUBLIC_MONTHLY_BASIC_PRICE_ID,
			interval: "month",
			trial: false,
			features: [
				"1 active portfolios",
				"All Free features",
				"Blog enabled (up to 10 articles)",
				"Custom domain support",
			],
			portfolioLimit: 1,
			blogLimit: 10,
			blogEnabled: true,
			slug: "basic_monthly",
		},
	},
	PRO: {
		monthly: {
			price: 24.99,
			priceId: process.env.NEXT_PUBLIC_MONTHLY_PRO_PRICE_ID,
			interval: "month",
			features: [
				"3 active portfolios",
				"All Basic features",
				"Blog enabled (up to 30 articles)",
				// "Premium templates",
				// "Analytics dashboard",
			],
			portfolioLimit: 3,
			blogLimit: 30,
			blogEnabled: true,
			slug: "pro_monthly",
		},
	},
};

export const getPlanPriceId = (type, tier, frequency) => {
	return SUBSCRIPTION_PLANS[type][tier][frequency].priceId;
};

export const getPlanFeatures = (type, tier, frequency) => {
	return SUBSCRIPTION_PLANS[type][tier][frequency].features;
};

export const getSubscriptionData = (type, frequency) => {
	// Convert type to match SUBSCRIPTION_PLANS keys
	const planType = type.toUpperCase();

	// Validate plan type exists
	if (!SUBSCRIPTION_PLANS[planType]) {
		logger.error(`Invalid subscription type: ${type}`);
		throw new Error(`Invalid subscription type: ${type}`);
	}

	const freq = frequency.toLowerCase();
	const plan = SUBSCRIPTION_PLANS[planType][freq];

	// Validate frequency exists for plan type
	if (!plan) {
		logger.error(`Invalid frequency ${frequency} for plan type ${type}`);
		throw new Error(`Invalid frequency ${frequency} for plan type ${type}`);
	}

	let price = plan.price;
	let portfolioLimit = plan.portfolioLimit;

	return {
		price,
		priceId: plan.priceId,
		interval: plan.interval,
		trial: plan.trial,
		portfolioLimit,
		blogEnabled: plan.blogEnabled,
		blogLimit: plan.blogLimit,
		features: plan.features,
	};
};

// Check if user can create more portfolios
export const canCreatePortfolio = (subscription, currentPortfolioCount) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	const limit = subscription.portfolioLimit;
	return currentPortfolioCount < limit;
};

// Check if user can create blog articles
export const canCreateBlogArticle = (subscription, currentArticleCount) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	if (!subscription.blogEnabled) {
		return false;
	}

	// Check against blog limit
	return (
		!subscription.blogLimit || currentArticleCount < subscription.blogLimit
	);
};

// Check if user has access to premium features
export const hasPremiumFeatures = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	return subscription.type === "PRO";
};

// Check if user has access to analytics
export const hasAnalyticsAccess = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	return subscription.type === "PRO";
};

// Check if user has access to custom domain
export const hasCustomDomainAccess = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	// All plans support custom domains
	return true;
};

// Get user's portfolio limit
export const getUserPortfolioLimit = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return 0;
	}

	return subscription.portfolioLimit;
};

// Get user's blog limit
export const getUserBlogLimit = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return 0;
	}

	if (!subscription.blogEnabled) {
		return 0;
	}

	return subscription.blogLimit || 0;
};

// Check if user is in trial period
export const isInTrialPeriod = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	if (!subscription.trial || !subscription.startDate) {
		return false;
	}

	const trialEndDate = new Date(subscription.startDate);
	trialEndDate.setDate(trialEndDate.getDate() + subscription.trial);

	return new Date() < trialEndDate;
};
