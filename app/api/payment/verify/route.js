import { NextResponse } from "next/server";
import axios from "axios";
import {
	handlePaymentSuccess,
	handlePaymentFailure,
} from "@/services/subscription";
import { logger } from "@/lib/utils";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function POST(request) {
	try {
		const { tx_ref, status, transaction_id } = await request.json();

		if (status === "cancelled") {
			await handlePaymentFailure({
				transactionId: tx_ref,
			});

			return NextResponse.json({
				success: false,
				message: "Payment was cancelled",
				status: "cancelled",
			});
		}

		// Verify that the transaction was successful
		if (status === "successful") {
			// Verify payment with Flutterwave
			const response = await axios.get(
				`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
				{
					headers: {
						accept: "application/json",
						Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
						"Content-Type": "application/json",
					},
				}
			);
			const { data } = response.data;
			if (!(data.status === status) || !(data.tx_ref === tx_ref)) {
				await handlePaymentFailure({
					transactionId: tx_ref,
				});

				return NextResponse.json({
					success: false,
					message: "Payment was cancelled",
					status: "cancelled",
				});
			}

			await handlePaymentSuccess({
				transactionId: tx_ref,
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
