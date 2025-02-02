import { NextResponse } from "next/server";
import {
	handleChargeWebhook,
	handleSubscriptionCancelled,
} from "@/services/webhooks";
import { logger } from "@/lib/utils";

export async function POST(req) {
	const secretHash = process.env.FLW_SECRET_HASH;
	const signature = req.headers.get("verif-hash");

	if (!signature || signature !== secretHash) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const payload = await req.json();
		logger.info(`Received webhook: ${payload.event}`);

		switch (payload.event) {
			case "charge.completed":
				await handleChargeWebhook(payload.data);
				break;

			case "subscription.cancelled":
				await handleSubscriptionCancelled(payload.data);
				break;

			default:
				logger.info(`Unhandled webhook event: ${payload.event}`);
				break;
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		logger.error("Webhook processing error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 }
		);
	}
}
