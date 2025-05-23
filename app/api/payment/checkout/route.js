import { NextResponse } from "next/server";
import axios from "axios";
import {
	createTransaction,
	initializeSubscription,
	handlePaymentFailure,
} from "@/services/subscription";
import { logger } from "@/lib/utils";
import { getSubscriptionData } from "@/utils/subscription-plans";

export async function POST(request) {
	try {
		const body = await request.json();
		const { type, frequency, userEmail, userId, returnUrl } = body;

		// Validate all required fields
		if (!type || !frequency || !userEmail || !userId) {
			const missingFields = [];
			if (!type) missingFields.push("type");
			if (!frequency) missingFields.push("frequency");
			if (!userEmail) missingFields.push("userEmail");
			if (!userId) missingFields.push("userId");

			logger.error("Missing required fields", { missingFields });
			return NextResponse.json(
				{
					message: `Missing required fields: ${missingFields.join(", ")}`,
				},
				{ status: 400 }
			);
		}

		logger.info("Starting checkout process", {
			type,
			frequency,
			userEmail,
			userId,
		});

		let subscriptionData;
		try {
			logger.info("Getting subscription data", { type, frequency });
			subscriptionData = getSubscriptionData(type, frequency);
			logger.info("Subscription data retrieved", subscriptionData);
		} catch (error) {
			logger.error("Invalid subscription configuration", {
				type,
				frequency,
				error,
			});
			return NextResponse.json(
				{ message: error.message },
				{ status: 400 }
			);
		}

		const { price, priceId, portfolioLimit } = subscriptionData;

		if (!priceId) {
			logger.error("Invalid price configuration", {
				type,
				frequency,
			});
			return NextResponse.json(
				{ message: "Invalid subscription configuration" },
				{ status: 400 }
			);
		}

		logger.info("Initializing subscription");
		const subscriptionResult = await initializeSubscription({
			userId,
			portfolioLimit,
			type: type.toUpperCase(),
			frequency,
			priceId,
		});

		if (!subscriptionResult.success) {
			logger.error(
				"Subscription creation failed",
				subscriptionResult.error
			);
			return NextResponse.json(
				{ message: subscriptionResult.error },
				{ status: 400 }
			);
		}

		const subscription = subscriptionResult.data;
		logger.info("Subscription initialized", {
			subscriptionId: subscription.id,
		});

		logger.info("Creating transaction record");
		const txn = await createTransaction({
			userId,
			title: `${type} Subscription - ${frequency}`,
			subscriptionId: subscription.id,
			amount: price,
			priceId,
		});

		if (!txn.success) {
			logger.error("Transaction creation failed", txn.error);
			return NextResponse.json({ message: txn.error }, { status: 400 });
		}

		logger.info("Transaction created", { transactionId: txn.data.id });

		// Validate Flutterwave API key and redirect URL
		const flutterwaveKey = process.env.FLW_SECRET_KEY;
		const redirectUrl =
			returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success`;

		if (!flutterwaveKey) {
			logger.error("Flutterwave API key is missing");
			return NextResponse.json(
				{ message: "Payment service configuration error" },
				{ status: 500 }
			);
		}

		if (!redirectUrl) {
			logger.error("Redirect URL is missing");
			return NextResponse.json(
				{ message: "Invalid redirect configuration" },
				{ status: 400 }
			);
		}

		logger.info("Initiating Flutterwave payment");
		try {
			const flutterwaveResponse = await axios.post(
				"https://api.flutterwave.com/v3/payments",
				{
					tx_ref: txn.data.id,
					amount: price, // Add the amount field - this is required
					currency: "USD",
					payment_options: "card",
					redirect_url: redirectUrl,
					payment_plan: priceId, // Use payment plan instead of amount
					customer: {
						email: userEmail,
					},
					meta: {
						subscriptionId: subscription.id,
						type,
						frequency,
					},
					customizations: {
						title: `${type} Subscription`,
						description: `${frequency} subscription payment`,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${flutterwaveKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!flutterwaveResponse.data?.data?.link) {
				logger.error("Invalid Flutterwave response", {
					response: flutterwaveResponse.data,
				});
				throw new Error("Invalid payment link received");
			}

			logger.info("Flutterwave payment initiated", {
				paymentLink: flutterwaveResponse.data.data.link,
				transactionRef: txn.data.id,
			});

			return NextResponse.json({
				link: flutterwaveResponse.data.data.link,
				status: "success",
				transactionId: txn.data.id,
				transaction_id: flutterwaveResponse.data.data?.transaction_id, // Add this line
			});
		} catch (flwError) {
			logger.error("Flutterwave API error:", {
				error: flwError.message,
				response: flwError.response?.data,
				status: flwError.response?.status,
				data: {
					amount: price,
					currency: "USD",
					email: userEmail,
					transactionRef: txn.data.id,
				},
			});

			// Handle the failed transaction
			await handlePaymentFailure({ transactionId: txn.data.id });

			return NextResponse.json(
				{
					message: "Payment service error",
					details:
						flwError.response?.data?.message || flwError.message,
					transactionId: txn.data.id,
				},
				{ status: flwError.response?.status || 500 }
			);
		}
	} catch (error) {
		logger.error("Checkout process failed:", {
			error: error.message,
			stack: error.stack,
		});
		return NextResponse.json(
			{
				message: "Payment initialization failed",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
