import { NextResponse } from "next/server";
import Flutterwave from "flutterwave-node-v3";
import {
	handlePaymentSuccess,
	handlePaymentFailure,
} from "@/services/subscription";
import { logger } from "@/lib/utils";

const flw = new Flutterwave(
	process.env.FLW_PUBLIC_KEY,
	process.env.FLW_SECRET_KEY
);

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

		// Verify payment with Flutterwave SDK
		const response = await flw.Transaction.verify({ id: transaction_id });
		const { data } = response;

		// Verify transaction details
		const isValidTransaction =
			data.status === "successful" &&
			data.tx_ref === tx_ref &&
			data.currency === "USD"; // Add your expected currency

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
				amount: data.amount,
				currency: data.currency,
				customer: data.customer,
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
