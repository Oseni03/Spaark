// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { createTransaction } from "@/services/subscription";
import { logger } from "@/lib/utils";

export async function POST(request) {
	try {
		// Parse the incoming request body
		const body = await request.json();
		const { priceId, title, userEmail, username, userId, amount } = body;

		// Validate required fields
		if (!priceId || !userEmail || !userId || !amount) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Create a pending transaction
		const txn_resp = await createTransaction({
			userId,
			title,
			priceId,
		});
		if (!txn_resp.success) {
			return NextResponse.json(txn_resp);
		}

		const transaction = txn_resp.data;

		// Make the Flutterwave API call
		const flutterwaveResponse = await axios.post(
			"https://api.flutterwave.com/v3/payments",
			{
				tx_ref: transaction.id,
				currency: "USD",
				redirect_url: process.env.FLW_REDIRECT_URL,
				customer: {
					email: userEmail,
					name: username || "Unknown User",
				},
				customizations: {
					title: title || "Product Checkout",
				},
				payment_plan: priceId,
				amount: amount,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		// Return the payment link
		return NextResponse.json(
			{
				link: flutterwaveResponse.data.data.link,
				status: flutterwaveResponse.data.status,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Comprehensive error handling
		logger.error("Checkout API Error:", error);

		if (axios.isAxiosError(error)) {
			// Handle Axios-specific errors
			return NextResponse.json(
				{
					message: "Payment gateway error",
					details: error.response?.data || error.message,
				},
				{ status: error.response?.status || 500 }
			);
		}

		// Generic error response
		return NextResponse.json(
			{
				message: "Unexpected error during checkout",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
