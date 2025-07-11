import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";

export async function POST(req) {
	try {
		const payload = await req.json();
		logger.info(`Received Polar webhook: ${payload.event}`);

		// TODO: Handle Polar webhook events (subscription.created, subscription.updated, etc)

		return NextResponse.json({ received: true });
	} catch (error) {
		logger.error("Polar webhook processing error:", error);
		return NextResponse.json(
			{ error: "Polar webhook processing failed" },
			{ status: 500 }
		);
	}
}