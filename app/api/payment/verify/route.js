import { NextResponse } from "next/server";
import {
	handlePaymentSuccess,
	handlePaymentFailure,
} from "@/services/subscription";
import { logger } from "@/lib/utils";
import { paymentService } from "@/services/payment";

export async function POST(request) {
	try {
		const { tx_ref, status, transaction_id } = await request.json();

		if (!transaction_id || status !== "successful") {
			await handlePaymentFailure({
				transactionId: tx_ref,
			});

			return NextResponse.json({
				success: false,
				message: !transaction_id
					? "Payment was cancelled - Missing transaction ID"
					: "Payment was not successful",
				status: "cancelled",
			});
		}

		logger.info("Verifying payment", {
			transactionId: transaction_id,
			reference: tx_ref,
			provider: paymentService.getCurrentProvider(),
		});

		// Verify payment with the payment service
		const response = await paymentService.verifyPayment(transaction_id);

		// Verify transaction details
		const isValidTransaction =
			response.status === "successful" &&
			response.tx_ref === tx_ref &&
			response.currency === "USD"; // Add your expected currency

		if (!isValidTransaction) {
			await handlePaymentFailure({
				transactionId: tx_ref,
			});

			return NextResponse.json({
				success: false,
				message: "Payment was cancelled",
				status: "cancelled",
			});
		}

		// Handle successful transaction
		await handlePaymentSuccess({
			transactionId: tx_ref,
		});

		return NextResponse.json({
			success: true,
			message: "Payment verified successfully",
			data: {
				amount: response.amount,
				currency: response.currency,
				customer: response.customer,
			},
		});
	} catch (error) {
		logger.error("Payment verification error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Error verifying payment",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
