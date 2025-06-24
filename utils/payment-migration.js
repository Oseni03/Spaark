import { paymentService, PAYMENT_PROVIDERS } from "@/services/payment";
import { logger } from "@/lib/utils";

/**
 * Utility functions for payment provider migration
 */

/**
 * Switch payment provider (for testing or migration)
 * @param {string} provider - The payment provider to switch to
 */
export function switchPaymentProvider(provider) {
	try {
		paymentService.switchProvider(provider);
		logger.info(`Successfully switched to ${provider} payment provider`);
		return { success: true, provider };
	} catch (error) {
		logger.error(`Failed to switch payment provider: ${error.message}`);
		return { success: false, error: error.message };
	}
}

/**
 * Get current payment provider configuration
 */
export function getCurrentPaymentProvider() {
	return {
		provider: paymentService.getCurrentProvider(),
		config: paymentService.config,
	};
}

/**
 * Validate payment provider configuration
 * @param {string} provider - The payment provider to validate
 */
export function validatePaymentProviderConfig(provider) {
	const requiredEnvVars = {
		[PAYMENT_PROVIDERS.FLUTTERWAVE]: [
			"FLW_SECRET_KEY",
			"FLW_PUBLIC_KEY",
			"FLW_SECRET_HASH",
		],
		[PAYMENT_PROVIDERS.PAYSTACK]: [
			"PAYSTACK_SECRET_KEY",
			"PAYSTACK_PUBLIC_KEY",
			"PAYSTACK_WEBHOOK_SECRET",
		],
	};

	const missingVars = [];
	const required = requiredEnvVars[provider] || [];

	for (const envVar of required) {
		if (!process.env[envVar]) {
			missingVars.push(envVar);
		}
	}

	return {
		valid: missingVars.length === 0,
		missing: missingVars,
		provider,
	};
}

/**
 * Migration checklist for switching payment providers
 */
export const PAYMENT_MIGRATION_CHECKLIST = {
	[PAYMENT_PROVIDERS.PAYSTACK]: [
		"Update environment variables with Paystack credentials",
		"Update webhook endpoints to handle Paystack webhooks",
		"Test payment processing with Paystack test cards",
		"Update success/failure redirect URLs",
		"Verify webhook signature validation",
		"Update error handling for Paystack-specific errors",
		"Test subscription management with Paystack",
		"Update documentation and user guides",
	],
	[PAYMENT_PROVIDERS.FLUTTERWAVE]: [
		"Update environment variables with Flutterwave credentials",
		"Update webhook endpoints to handle Flutterwave webhooks",
		"Test payment processing with Flutterwave test cards",
		"Update success/failure redirect URLs",
		"Verify webhook signature validation",
		"Update error handling for Flutterwave-specific errors",
		"Test subscription management with Flutterwave",
		"Update documentation and user guides",
	],
};

/**
 * Get migration checklist for a specific provider
 * @param {string} provider - The payment provider
 */
export function getMigrationChecklist(provider) {
	return PAYMENT_MIGRATION_CHECKLIST[provider] || [];
}

/**
 * Compare payment provider features
 */
export const PAYMENT_PROVIDER_FEATURES = {
	[PAYMENT_PROVIDERS.FLUTTERWAVE]: {
		cardPayments: true,
		bankTransfers: true,
		mobileMoney: true,
		subscriptions: true,
		webhooks: true,
		refunds: true,
		currencies: ["USD", "NGN", "GHS", "KES", "ZAR"],
		regions: ["Africa", "Global"],
	},
	[PAYMENT_PROVIDERS.PAYSTACK]: {
		cardPayments: true,
		bankTransfers: true,
		mobileMoney: true,
		subscriptions: true,
		webhooks: true,
		refunds: true,
		currencies: ["NGN", "USD", "GHS", "ZAR", "KES"],
		regions: ["Nigeria", "Ghana", "South Africa", "Kenya"],
	},
};

/**
 * Get provider features
 * @param {string} provider - The payment provider
 */
export function getProviderFeatures(provider) {
	return PAYMENT_PROVIDER_FEATURES[provider] || {};
}

/**
 * Check if a feature is supported by a provider
 * @param {string} provider - The payment provider
 * @param {string} feature - The feature to check
 */
export function isFeatureSupported(provider, feature) {
	const features = getProviderFeatures(provider);
	return features[feature] || false;
}
