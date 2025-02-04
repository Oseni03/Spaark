export const SUBSCRIPTION_PLANS = {
	INDIVIDUAL: {
		weekly: {
			name: "Individual Weekly Plan",
			description:
				"Perfect for individuals who need a short-term solution with all essential features.",
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
			name: "Individual Monthly Plan",
			description:
				"Ideal for individuals looking for a monthly subscription with comprehensive features.",
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
			name: "Individual Yearly Plan",
			description:
				"Best value for individuals who want a long-term subscription with all features included.",
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
	},
	TEAM: {
		monthly: {
			name: "Team Monthly Plan",
			description:
				"Great for teams needing collaboration tools and shared resources on a monthly basis.",
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
			name: "Team Yearly Plan",
			description:
				"Best value for teams looking for long-term collaboration tools and premium support.",
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

	// Validate frequency exists for plan type
	if (!plan) {
		logger.error(`Invalid frequency ${frequency} for plan type ${type}`);
		throw new Error(`Invalid frequency ${frequency} for plan type ${type}`);
	}

	return {
		price: plan.price,
		priceId: plan.priceId,
		interval: plan.interval,
	};
};
