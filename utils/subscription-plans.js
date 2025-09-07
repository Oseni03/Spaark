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

	return {
		price: plan.price,
		priceId: plan.priceId,
		interval: plan.interval,
		trial: plan.trial,
		portfolioLimit: plan.portfolioLimit,
		blogEnabled: plan.blogEnabled,
		blogLimit: plan.blogLimit,
		features: plan.features,
	};
};

// Utility to map productId to plan type and frequency
export function getPlanTypeByProductId(productId) {
	for (const [type, tiers] of Object.entries(SUBSCRIPTION_PLANS)) {
		for (const [frequency, plan] of Object.entries(tiers)) {
			if (plan.priceId === productId) {
				return { type, frequency };
			}
		}
	}
	return { type: "FREE", frequency: "monthly" };
}
