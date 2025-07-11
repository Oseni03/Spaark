import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { COOKIE_NAME } from "@/utils/constants";
import { logger } from "@/lib/utils";
import { createCheckoutSession } from "@polar-sh/nextjs/server";

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
	try {
		const authToken = request.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { planType } = await request.json(); // Expect planType in body

		// TODO: Map planType to Polar product/price ID
		const POLAR_PRODUCT_ID = process.env.POLAR_PRODUCT_ID;
		const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

		if (!POLAR_PRODUCT_ID || !POLAR_ACCESS_TOKEN) {
			return new NextResponse("Polar config missing", { status: 500 });
		}

		// Create checkout session with Polar
		const session = await createCheckoutSession({
			accessToken: POLAR_ACCESS_TOKEN,
			productId: POLAR_PRODUCT_ID,
			customerId: userId, // or email if required
			// Optionally pass success/cancel URLs
		});

		// Optionally, store session.id in Subscription for later verification
		await prisma.subscription.update({
			where: { userId },
			data: { polarSubscriptionId: session.id },
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		logger.error("Error creating Polar checkout session:", error);
		return new NextResponse("Failed to create checkout session", { status: 500 });
	}
}
