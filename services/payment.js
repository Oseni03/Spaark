import axios from "axios";
import { logger } from "@/lib/utils";

// Payment Provider Configuration
const PAYMENT_PROVIDERS = {
	POLAR: "polar",
};

// Current payment provider (can be easily changed)
const CURRENT_PROVIDER = PAYMENT_PROVIDERS.POLAR;

class PaymentService {
	constructor() {
		this.provider = CURRENT_PROVIDER;
	}

	getProviderConfig() {
		// Only Polar config
		return {
			accessToken: process.env.POLAR_ACCESS_TOKEN,
		};
	}

	// Process card payment
	async processCardPayment(paymentData) {
		// Only Polar: redirect to checkout session
		throw new Error("Direct card payment not supported. Use Polar checkout session.");
	}

	// Verify payment
	async verifyPayment(transactionId) {
		// Only Polar: implement if needed
		throw new Error("Payment verification not supported. Use Polar webhook.");
	}

	// Create payment link (for redirect-based payments)
	async createPaymentLink(paymentData) {
		// Only Polar: implement if needed
		throw new Error("Payment link not supported. Use Polar checkout session.");
	}
}

module.exports = new PaymentService();

// Export provider constants
export { PAYMENT_PROVIDERS };
