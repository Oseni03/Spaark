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
		const { type, frequency, userEmail, username, userId, returnUrl } =
			body;

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
			type: type.toUpperCase(),
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

		logger.info("Initiating Paystack payment");
		const paystackResponse = await axios.post(
			"https://api.paystack.co/transaction/initialize",
			{
				email: userEmail,
				plan: priceId, // Using priceId as Paystack plan code
				reference: txn.data.id,
				callback_url: returnUrl || process.env.NEXT_PUBLIC_APP_URL,
				metadata: {
					subscriptionId: subscription.id,
					type,
					frequency,
					price, // Keep price in metadata for tracking
					custom_fields: [
						{
							display_name: "Subscription Type",
							variable_name: "subscription_type",
							value: type,
						},
					],
				},
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		logger.info("Paystack payment initiated", {
			paymentLink: paystackResponse.data.data.authorization_url,
		});

		return NextResponse.json({
			link: paystackResponse.data.data.authorization_url,
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
