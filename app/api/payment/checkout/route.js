import { NextResponse } from "next/server";
import axios from "axios";
import {
	createTransaction,
	initializeSubscription,
} from "@/services/subscription";
import { logger } from "@/lib/utils";
import { getSubscriptionData } from "@/utils/subscription-plans";

export async function POST(request) {
	try {
		const body = await request.json();
		const { type, frequency, userEmail, username, userId } = body;

		logger.info("Starting checkout process", {
			type,
			frequency,
			userEmail,
			userId,
		});

		if (!type || !frequency || !userEmail || !userId) {
			logger.error("Missing required fields", {
				type,
				frequency,
				userEmail,
				userId,
			});
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

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

		const { price, priceId } = subscriptionData;

		logger.info("Initializing subscription");
		const subscription = await initializeSubscription({
			userId,
			type,
			frequency,
			priceId,
		});

		if (!subscription) {
			logger.error("Subscription creation failed");
			return NextResponse.json(
				{ message: "Unable to create subscription" },
				{ status: 400 }
			);
		}
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
		logger.info("Transaction created", { transactionId: txn.data.id });

		logger.info("Initiating Flutterwave payment");
		const flutterwaveResponse = await axios.post(
			"https://api.flutterwave.com/v3/payments",
			{
				tx_ref: txn.data.id,
				amount: price,
				currency: "USD",
				payment_options: "card",
				redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
				customer: {
					email: userEmail,
					name: username || "Unknown User",
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
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
				},
			}
		);
		logger.info("Flutterwave payment initiated", {
			paymentLink: flutterwaveResponse.data.data.link,
		});

		return NextResponse.json({
			link: flutterwaveResponse.data.data.link,
			status: "success",
		});
	} catch (error) {
		logger.error("Checkout process failed:", {
			error: error.message,
			stack: error.stack,
		});
		return NextResponse.json(
			{ message: error.message || "Payment initialization failed" },
			{ status: 500 }
		);
	}
}
