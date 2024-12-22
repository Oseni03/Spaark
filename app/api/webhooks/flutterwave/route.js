import { NextResponse } from "next/server";
import { handleCancelledSubscription } from "@/services/flutterwave";

export async function POST(req) {
	const secretHash = process.env.FLW_SECRET_HASH;
	const signature = req.headers.get("verif-hash");

	// Validate the signature
	if (!signature || signature !== secretHash) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const payload = await req.json(); // Parse the JSON payload

		// Log the received payload for debugging purposes
		console.log("Webhook payload:", payload);

		if (
			payload.event === "subscription.cancelled" &&
			payload.data.status === "deactivated"
		) {
			await handleCancelledSubscription(payload.data);
		}

		// Respond quickly to confirm receipt
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error handling webhook:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
