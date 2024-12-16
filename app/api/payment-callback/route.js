import { NextResponse } from "next/server";
import { updateSubscription, updateTransaction } from "@/services/subscription";

export async function POST(req) {
	const body = await req.json();

	const { tx_ref, status } = body;

	if (!tx_ref || !status) {
		return NextResponse.json({ error: "Missing required fields" });
	}

	try {
		const transaction = await updateTransaction({ tx_ref, status });
		if (!transaction.success) {
			return NextResponse.json({ error: "Unable to update transaction" });
		}

		// Additional logic for successful transactions
		if (status === "successful") {
			const sub = await updateSubscription();
			if (!sub.success) {
				return NextResponse.json({
					error: sub?.error || "Error updating user subscription",
				});
			}
		}

		return NextResponse.json({ success: true, transaction });
	} catch (error) {
		console.error("Error updating transaction:", error);
		return NextResponse.json({ error: "Internal server error" });
	}
}
