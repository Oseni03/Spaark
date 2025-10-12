// Webhook route (unchanged structure, but simplified internals)
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import { validateEvent } from "@polar-sh/sdk/webhooks.js";
import { prisma } from "@/lib/db";
import { processSubscriptionEvent } from "@/services/subscription";

export async function POST(req) {
	try {
		const body = await req.text();
		const headers = Object.fromEntries(req.headers.entries());
		const event = validateEvent(
			body,
			headers,
			process.env.POLAR_WEBHOOK_SECRET ||
				(() => {
					throw new Error("Missing POLAR_WEBHOOK_SECRET");
				})()
		);
		const payload = JSON.parse(body);
		const { data, type } = payload;

		const subscriptionEvents = [
			"subscription.created",
			"subscription.active",
			"subscription.canceled",
			"subscription.revoked",
			"subscription.uncanceled",
			"subscription.updated",
		];

		if (!subscriptionEvents.includes(type)) {
			return new NextResponse("", { status: 202 });
		}

		if (!data?.id || !data?.status) {
			logger.error("Invalid webhook payload", { type, data });
			return new NextResponse("Invalid payload", { status: 400 });
		}

		const userId = data.customer?.external_id;
		if (!userId) {
			logger.error("Missing user ID in webhook");
			return new NextResponse("Missing user ID", { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			logger.error(`User ${userId} not found`);
			return new NextResponse("User not found", { status: 400 });
		}

		await prisma.$transaction(async (tx) => {
			await processSubscriptionEvent(tx, type, data, userId);
		});

		logger.info(`✅ Processed ${type} for user ${userId}`);
		return new NextResponse("", { status: 202 });
	} catch (error) {
		return handleWebhookError(error);
	}
}

function handleWebhookError(error) {
	// Unchanged, but ensure 500 for retries
	if (error instanceof WebhookVerificationError) {
		return new NextResponse("Unauthorized", { status: 403 });
	}
	if (error.code === "P2002") {
		// Unique violation (e.g., duplicate userId)
		logger.warn("Duplicate subscription attempt, ignoring");
		return new NextResponse("", { status: 202 });
	}
	logger.error("Webhook error:", error);
	return new NextResponse("Internal Server Error", { status: 500 });
}
