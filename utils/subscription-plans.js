export const SUBSCRIPTION_PLANS = {
	FREE: {
		monthly: {
			price: 0,
			priceId: process.env.NEXT_PUBLIC_MONTHLY_BASIC_PRICE_ID,
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
		},
	},
	// CUSTOM: {
	// 	monthly: {
	// 		basePrice: 49.55,
	// 		pricePerPortfolio: 5,
	// 		pricePerArticle: 1,
	// 		priceId: process.env.NEXT_PUBLIC_MONTHLY_CUSTOM_PRICE_ID,
	// 		interval: "month",
	// 		features: [
	// 			"Custom number of portfolios",
	// 			"All Pro features",
	// 			"Unlimited blog articles",
	// 			"Priority support",
	// 			"Custom features on request",
	// 		],
	// 		customizable: true,
	// 		blogEnabled: true,
	// 	},
	// },
};

export const getPlanPrice = (type, tier, frequency) => {
	return SUBSCRIPTION_PLANS[type][tier][frequency].price;
};

export const getPlanPriceId = (type, tier, frequency) => {
	return SUBSCRIPTION_PLANS[type][tier][frequency].priceId;
};

export const getPlanFeatures = (type, tier, frequency) => {
	return SUBSCRIPTION_PLANS[type][tier][frequency].features;
};

// Calculate custom price for CUSTOM plan
export const calculateCustomPrice = (
	basePrice,
	portfolios,
	articles,
	pricePerPortfolio,
	pricePerArticle
) => {
	const portfolioCost = (portfolios - 3) * pricePerPortfolio; // Pro plan has 3 portfolios
	const articleCost = Math.max(0, articles - 10) * pricePerArticle; // Pro plan has 10 articles
	return basePrice + portfolioCost + articleCost;
};

// Validate plan limits for custom configuration
export const validatePlanLimits = (type, portfolios, articles) => {
	if (type !== "CUSTOM") return true;

	// Custom plan limits
	const minPortfolios = 5;
	const maxPortfolios = 20;
	const minArticles = 20;
	const maxArticles = 100;

	return (
		portfolios >= minPortfolios &&
		portfolios <= maxPortfolios &&
		articles >= minArticles &&
		articles <= maxArticles
	);
};

export const getSubscriptionData = (type, frequency, customConfig = null) => {
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

	// Calculate price for custom plan
	let price = plan.price;
	let portfolioLimit = plan.portfolioLimit;
	let customPortfolioLimit = null;
	let customArticleLimit = null;

	if (planType === "CUSTOM" && customConfig) {
		price = calculateCustomPrice(
			plan.basePrice,
			customConfig.portfolios,
			customConfig.articles,
			plan.pricePerPortfolio,
			plan.pricePerArticle
		);
		portfolioLimit = customConfig.portfolios;
		customPortfolioLimit = customConfig.portfolios;
		customArticleLimit = customConfig.articles;
	}

	return {
		price,
		priceId: plan.priceId,
		interval: plan.interval,
		trial: plan.trial,
		portfolioLimit,
		blogEnabled: plan.blogEnabled,
		blogLimit: plan.blogLimit,
		customizable: plan.customizable,
		customPortfolioLimit,
		customArticleLimit,
		features: plan.features,
	};
};

// Check if user can create more portfolios
export const canCreatePortfolio = (subscription, currentPortfolioCount) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	const limit =
		subscription.customPortfolioLimit || subscription.portfolioLimit;
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

	// Custom plan has unlimited articles
	if (subscription.customizable) {
		return true;
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

	return subscription.type === "PRO" || subscription.type === "CUSTOM";
};

// Check if user has access to analytics
export const hasAnalyticsAccess = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return false;
	}

	return subscription.type === "PRO" || subscription.type === "CUSTOM";
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

	return subscription.customPortfolioLimit || subscription.portfolioLimit;
};

// Get user's blog limit
export const getUserBlogLimit = (subscription) => {
	if (!subscription || subscription.status !== "active") {
		return 0;
	}

	if (!subscription.blogEnabled) {
		return 0;
	}

	// Custom plan has unlimited articles
	if (subscription.customizable) {
		return -1; // -1 indicates unlimited
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
