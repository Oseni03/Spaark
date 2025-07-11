import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { COOKIE_NAME } from "@/utils/constants";
import { logger } from "@/lib/utils";

export async function GET(request) {
	try {
		const authToken = request.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Get user with simplified subscription details
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				subscription: true,
			},
		});

		if (!user) {
			return new NextResponse("User not found", { status: 404 });
		}

		const subscription = user.subscription
			? {
				id: user.subscription.id,
				polarSubscriptionId: user.subscription.polarSubscriptionId,
				status: user.subscription.status,
				planType: user.subscription.planType,
				blogEnabled: user.subscription.blogEnabled,
				blogLimit: user.subscription.blogLimit,
				customPortfolioLimit: user.subscription.customPortfolioLimit,
				createdAt: user.subscription.createdAt,
				updatedAt: user.subscription.updatedAt,
			}
			: null;

		return NextResponse.json(subscription);
	} catch (error) {
		logger.error("Error fetching user subscription:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

// Polar: Create a new checkout session for subscription (stub)
export async function POST(request) {
	// TODO: Implement Polar checkout session creation
	return NextResponse.json({ message: "Polar checkout session creation not implemented yet." }, { status: 501 });
}
