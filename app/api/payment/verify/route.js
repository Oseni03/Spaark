import { NextResponse } from "next/server";
import axios from "axios";
import { handlePaymentSuccess } from "@/services/subscription";
import { logger } from "@/lib/utils";

export async function POST(request) {
	try {
		const { tx_ref, transaction_id, status } = await request.json();

		// Verify payment with Flutterwave
		const response = await axios.get(
			`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
			{
				headers: {
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
				},
			}
		);

		const { data } = response.data;

		// Verify that the transaction was successful and amounts match
		if (
			data.status === "successful" &&
			data.tx_ref === tx_ref &&
			status === "successful"
		) {
			// Update local transaction and subscription records
			await handlePaymentSuccess({
				transactionId: tx_ref,
				subscriptionId: data.meta.subscriptionId,
			});

			return NextResponse.json({
				success: true,
				message: "Payment verified successfully",
			});
		}

		return NextResponse.json(
			{
				success: false,
				message: "Payment verification failed",
			},
			{ status: 400 }
		);
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
