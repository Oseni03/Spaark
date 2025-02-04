import { NextResponse } from "next/server";
import {
	handlePaymentSuccess,
	handlePaymentFailure,
} from "@/services/subscription";
import { logger } from "@/lib/utils";
import crypto from "crypto";

function verifyPaystackSignature(payload, signature) {
	const hash = crypto
		.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(payload))
		.digest("hex");
	return hash === signature;
}

export async function POST(request) {
	try {
		const signature = request.headers.get("x-paystack-signature");
		const payload = await request.json();

		if (!signature || !verifyPaystackSignature(payload, signature)) {
			return NextResponse.json(
				{ error: "Invalid signature" },
				{ status: 401 }
			);
		}

		logger.info(`Received Paystack webhook: ${payload.event}`);

		switch (payload.event) {
			case "charge.success":
				await handlePaymentSuccess({
					transactionId: payload.data.reference,
				});
				break;

			case "subscription.create":
				logger.info("New subscription created", {
					subscriptionCode: payload.data.subscription_code,
					customer: payload.data.customer.email,
				});
				break;

			case "subscription.disable":
			case "subscription.not_renew":
				await handlePaymentFailure({
					transactionId: payload.data.subscription_code,
				});
				break;

			case "invoice.payment_failed":
				await handlePaymentFailure({
					transactionId: payload.data.subscription.subscription_code,
				});
				break;

			default:
				logger.info(`Unhandled webhook event: ${payload.event}`);
				break;
		}

		return NextResponse.json({ status: "success" });
	} catch (error) {
		logger.error("Webhook processing error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}
