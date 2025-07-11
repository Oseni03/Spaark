import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/utils";

export async function POST(req) {
	try {
		const payload = await req.json();
		logger.info(`Received Polar webhook: ${payload.event}`);

		const data = payload.data;
		const event = payload.event;

		// Handle Polar webhook events
		switch (event) {
			case "subscription.created":
				await prisma.subscription.updateMany({
					where: { polarSubscriptionId: data.id },
					data: {
						status: data.status,
						planType: data.planType || data.plan || "",
					},
				});
				break;
			case "subscription.updated":
				await prisma.subscription.updateMany({
					where: { polarSubscriptionId: data.id },
					data: {
						status: data.status,
						planType: data.planType || data.plan || "",
					},
				});
				break;
			case "subscription.cancelled":
				await prisma.subscription.updateMany({
					where: { polarSubscriptionId: data.id },
					data: { status: "cancelled" },
				});
				break;
			default:
				logger.info(`Unhandled Polar webhook event: ${event}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		logger.error("Polar webhook processing error:", error);
		return NextResponse.json(
			{ error: "Polar webhook processing failed" },
			{ status: 500 }
		);
	}
}