import axios from "axios";
import { logger } from "@/lib/utils";

// Payment Provider Configuration
const PAYMENT_PROVIDERS = {
	FLUTTERWAVE: "flutterwave",
	PAYSTACK: "paystack",
	POLAR: "polar",
};

// Current payment provider (can be easily changed)
const CURRENT_PROVIDER = PAYMENT_PROVIDERS.POLAR;

class PaymentService {
	constructor() {
		this.provider = CURRENT_PROVIDER;
		this.config = this.getProviderConfig();
	}

	getProviderConfig() {
		switch (this.provider) {
			case PAYMENT_PROVIDERS.FLUTTERWAVE:
				return {
					secretKey: process.env.FLW_SECRET_KEY,
					publicKey: process.env.FLW_PUBLIC_KEY,
					baseUrl: "https://api.flutterwave.com/v3",
					webhookSecret: process.env.FLW_SECRET_HASH,
				};
			case PAYMENT_PROVIDERS.PAYSTACK:
				return {
					secretKey: process.env.PAYSTACK_SECRET_KEY,
					publicKey: process.env.PAYSTACK_PUBLIC_KEY,
					baseUrl: "https://api.paystack.co",
					webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
				};
			case PAYMENT_PROVIDERS.POLAR:
				return {
					accessToken: process.env.POLAR_ACCESS_TOKEN,
					baseUrl: "https://api.polar.sh/v1",
				};
			default:
				throw new Error(
					`Unsupported payment provider: ${this.provider}`
				);
		}
	}

	// Process card payment
	async processCardPayment(paymentData) {
		switch (this.provider) {
			case PAYMENT_PROVIDERS.FLUTTERWAVE:
				return this.processFlutterwaveCardPayment(paymentData);
			case PAYMENT_PROVIDERS.PAYSTACK:
				return this.processPaystackCardPayment(paymentData);
			case PAYMENT_PROVIDERS.POLAR:
				// Polar does not support direct card payments, use checkout link
				return {
					success: false,
					message: "Direct card payments are not supported with Polar. Use createPaymentLink instead.",
				};
			default:
				throw new Error(
					`Unsupported payment provider: ${this.provider}`
				);
		}
	}

	// Flutterwave card payment
	async processFlutterwaveCardPayment(paymentData) {
		const {
			card_number,
			cvv,
			expiry_month,
			expiry_year,
			currency,
			amount,
			email,
			tx_ref,
			cardholder_name,
			meta = {},
			priceId,
		} = paymentData;

		try {
			const response = await axios.post(
				`${this.config.baseUrl}/charges?type=card`,
				{
					card_number,
					cvv,
					expiry_month,
					expiry_year,
					currency,
					amount,
					email,
					tx_ref,
					cardholder_name,
					// authorization: {
					// 	mode: "pin",
					// 	pin: "3310", // This would be collected from user in a real implementation
					// },
					meta,
					payment_plan: planId,
				},
				{
					headers: {
						Authorization: `Bearer ${this.config.secretKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			const { data } = response.data;

			return {
				success: data.status === "successful",
				status: data.status,
				transaction_id: data.id,
				reference: data.flw_ref,
				message: data.message,
				requires_verification: data.status === "pending",
			};
		} catch (error) {
			logger.error("Flutterwave card payment error:", error);
			throw error;
		}
	}

	// Paystack card payment (for future implementation)
	async processPaystackCardPayment(paymentData) {
		const {
			card_number,
			cvv,
			expiry_month,
			expiry_year,
			currency,
			amount,
			email,
			tx_ref,
			cardholder_name,
			meta = {},
		} = paymentData;

		try {
			// Paystack implementation would go here
			// This is a placeholder for future Paystack integration
			const response = await axios.post(
				`${this.config.baseUrl}/transaction/charge_authorization`,
				{
					authorization_code: "AUTH_xxx", // This would be obtained from Paystack's card authorization
					email,
					amount: amount * 100, // Paystack uses kobo (smallest currency unit)
					currency,
					reference: tx_ref,
					metadata: meta,
				},
				{
					headers: {
						Authorization: `Bearer ${this.config.secretKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			const { data } = response.data;

			return {
				success: data.status === "success",
				status: data.status,
				transaction_id: data.id,
				reference: data.reference,
				message: data.gateway_response,
				requires_verification: false,
			};
		} catch (error) {
			logger.error("Paystack card payment error:", error);
			throw error;
		}
	}

	// Verify payment
	async verifyPayment(transactionId) {
		switch (this.provider) {
			case PAYMENT_PROVIDERS.FLUTTERWAVE:
				return this.verifyFlutterwavePayment(transactionId);
			case PAYMENT_PROVIDERS.PAYSTACK:
				return this.verifyPaystackPayment(transactionId);
			case PAYMENT_PROVIDERS.POLAR:
				return this.verifyPolarPayment(transactionId);
			default:
				throw new Error(
					`Unsupported payment provider: ${this.provider}`
				);
		}
	}

	// Flutterwave payment verification
	async verifyFlutterwavePayment(transactionId) {
		try {
			const response = await axios.get(
				`${this.config.baseUrl}/transactions/${transactionId}/verify`,
				{
					headers: {
						Authorization: `Bearer ${this.config.secretKey}`,
					},
				}
			);

			const { data } = response.data;

			return {
				success: data.status === "successful",
				status: data.status,
				amount: data.amount,
				currency: data.currency,
				customer: data.customer,
				reference: data.tx_ref,
			};
		} catch (error) {
			logger.error("Flutterwave payment verification error:", error);
			throw error;
		}
	}

	// Paystack payment verification (for future implementation)
	async verifyPaystackPayment(transactionId) {
		try {
			const response = await axios.get(
				`${this.config.baseUrl}/transaction/verify/${transactionId}`,
				{
					headers: {
						Authorization: `Bearer ${this.config.secretKey}`,
					},
				}
			);

			const { data } = response.data;

			return {
				success: data.status === "success",
				status: data.status,
				amount: data.amount / 100, // Convert from kobo to naira
				currency: data.currency,
				customer: data.customer,
				reference: data.reference,
			};
		} catch (error) {
			logger.error("Paystack payment verification error:", error);
			throw error;
		}
	}

	// Create payment link (for redirect-based payments)
	async createPaymentLink(paymentData) {
		switch (this.provider) {
			case PAYMENT_PROVIDERS.FLUTTERWAVE:
				return this.createFlutterwavePaymentLink(paymentData);
			case PAYMENT_PROVIDERS.PAYSTACK:
				return this.createPaystackPaymentLink(paymentData);
			case PAYMENT_PROVIDERS.POLAR:
				return this.createPolarPaymentLink(paymentData);
			default:
				throw new Error(
					`Unsupported payment provider: ${this.provider}`
				);
		}
	}

	// Flutterwave payment link
	async createFlutterwavePaymentLink(paymentData) {
		const {
			tx_ref,
			amount,
			currency,
			redirect_url,
			payment_options,
			customer,
			meta,
			customizations,
		} = paymentData;

		try {
			const response = await axios.post(
				`${this.config.baseUrl}/payments`,
				{
					tx_ref,
					amount,
					currency,
					payment_options,
					redirect_url,
					customer,
					meta,
					customizations,
				},
				{
					headers: {
						Authorization: `Bearer ${this.config.secretKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			return {
				success: true,
				link: response.data.data.link,
				transaction_id: response.data.data.transaction_id,
			};
		} catch (error) {
			logger.error("Flutterwave payment link error:", error);
			throw error;
		}
	}

	// Paystack payment link (for future implementation)
	async createPaystackPaymentLink(paymentData) {
		const { reference, amount, currency, callback_url, email, metadata } =
			paymentData;

		try {
			const response = await axios.post(
				`${this.config.baseUrl}/transaction/initialize`,
				{
					reference,
					amount: amount * 100, // Convert to kobo
					currency,
					callback_url,
					email,
					metadata,
				},
				{
					headers: {
						Authorization: `Bearer ${this.config.secretKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			return {
				success: true,
				link: response.data.data.authorization_url,
				transaction_id: response.data.data.reference,
			};
		} catch (error) {
			logger.error("Paystack payment link error:", error);
			throw error;
		}
	}

	// Polar payment link (checkout session)
	async createPolarPaymentLink(paymentData) {
		const {
			amount,
			currency,
			success_url,
			cancel_url,
			customer_email,
			customer_name,
			product_id,
			product_price_id,
			metadata = {},
		} = paymentData;

		try {
			const response = await axios.post(
				`${this.config.baseUrl}/checkouts`,
				{
					amount,
					currency,
					success_url,
					cancel_url,
					customer_email,
					customer_name,
					product_id,
					product_price_id,
					metadata,
				},
				{
					headers: {
						Authorization: `Bearer ${this.config.accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			const data = response.data;
			return {
				success: true,
				link: data.url,
				checkout_id: data.id,
			};
		} catch (error) {
			logger.error("Polar payment link error:", error);
			throw error;
		}
	}

	// Polar payment verification
	async verifyPolarPayment(checkoutId) {
		try {
			const response = await axios.get(
				`${this.config.baseUrl}/checkouts/${checkoutId}`,
				{
					headers: {
						Authorization: `Bearer ${this.config.accessToken}`,
					},
				}
			);
			const data = response.data;
			return {
				success: data.status === "open" || data.status === "completed",
				status: data.status,
				amount: data.amount,
				currency: data.currency,
				customer: {
					email: data.customer_email,
					name: data.customer_name,
				},
				reference: data.id,
			};
		} catch (error) {
			logger.error("Polar payment verification error:", error);
			throw error;
		}
	}

	// Get current provider
	getCurrentProvider() {
		return this.provider;
	}

	// Switch provider (for testing or migration)
	switchProvider(provider) {
		if (!PAYMENT_PROVIDERS[provider.toUpperCase()]) {
			throw new Error(`Unsupported payment provider: ${provider}`);
		}
		this.provider = provider;
		this.config = this.getProviderConfig();
		logger.info(`Switched to payment provider: ${provider}`);
	}
}

// Export singleton instance
export const paymentService = new PaymentService();

// Export provider constants
export { PAYMENT_PROVIDERS };
