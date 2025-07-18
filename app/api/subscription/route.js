import { getUserIdFromSession } from "@/lib/auth-utils";
import { getSubscriptionDetails } from "@/services/subscription";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const userId = await getUserIdFromSession();

		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const subscriptionDetails = await getSubscriptionDetails();
		return NextResponse.json(subscriptionDetails);
	} catch (error) {
		console.error("Error fetching subscription details:", error);
		return NextResponse.json(
			{ error: "Failed to fetch subscription details" },
			{ status: 500 }
		);
	}
}
