export const SUBSCRIPTION_PLANS = {
	INDIVIDUAL: {
		weekly: {
			price: 3,
			priceId: process.env.NEXT_PUBLIC_WEEKLY_INDIVIDUAL_PRICE_ID,
			interval: "week",
			features: [
				"Unlimited portfolio pages",
				"Custom domain support",
				"Project showcase",
				"Skills visualization",
				"Resume builder",
				"Social media integration",
			],
		},
		monthly: {
			price: 10,
			priceId: process.env.NEXT_PUBLIC_MONTHLY_INDIVIDUAL_PRICE_ID,
			interval: "month",
			features: [
				"Unlimited portfolio pages",
				"Custom domain support",
				"Project showcase",
				"Skills visualization",
				"Resume builder",
				"Social media integration",
			],
		},
		yearly: {
			price: 96,
			priceId: process.env.NEXT_PUBLIC_YEARLY_INDIVIDUAL_PRICE_ID,
			interval: "year",
			features: [
				"Unlimited portfolio pages",
				"Custom domain support",
				"Project showcase",
				"Skills visualization",
				"Resume builder",
				"Social media integration",
			],
		},
		portfolioLimit: 1,
	},
	TEAM: {
		monthly: {
			price: 25,
			priceId: process.env.NEXT_PUBLIC_MONTHLY_TEAM_PRICE_ID,
			interval: "month",
			features: [
				"All Individual features",
				"Team collaboration",
				"Shared templates",
				"Team analytics",
				"Priority support",
				"Custom branding",
			],
		},
		yearly: {
			price: 240,
			priceId: process.env.NEXT_PUBLIC_YEARLY_TEAM_PRICE_ID,
			interval: "year",
			features: [
				"All Individual features",
				"Team collaboration",
				"Shared templates",
				"Team analytics",
				"Priority support",
				"Custom branding",
			],
		},
		portfolioLimit: 3,
	},
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
	const portfolioLimit = SUBSCRIPTION_PLANS[planType]["portfolioLimit"];

	// Validate frequency exists for plan type
	if (!plan || !portfolioLimit) {
		logger.error(`Invalid frequency ${frequency} for plan type ${type}`);
		throw new Error(`Invalid frequency ${frequency} for plan type ${type}`);
	}

	return {
		price: plan.price,
		priceId: plan.priceId,
		interval: plan.interval,
		portfolioLimit,
	};
};
