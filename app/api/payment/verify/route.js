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
		const { reference } = await request.json();

		// Verify payment with Paystack
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		const { data } = response.data;

		if (data.status === "abandoned" || data.status === "failed") {
			await handlePaymentFailure({
				transactionId: reference,
			});

			return NextResponse.json({
				success: false,
				message: "Payment was cancelled",
				status: "cancelled",
			});
		}

		if (data.status === "success") {
			await handlePaymentSuccess({
				transactionId: reference,
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
