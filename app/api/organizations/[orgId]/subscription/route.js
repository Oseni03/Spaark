import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { COOKIE_NAME } from "@/utils/constants";
import { createCheckoutSession } from "@polar-sh/nextjs/server";

export async function GET(req, { params }) {
	try {
		const authToken = await req.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;
		const { orgId } = params;

		if (!userId || !orgId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if user is member of organization
		const membership = await prisma.organizationMember.findUnique({
			where: {
				userId_organizationId: {
					userId,
					organizationId: orgId,
				},
			},
		});

		if (!membership) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Fetch organization with subscription
		const organization = await prisma.organization.findUnique({
			where: { id: orgId },
			include: {
				subscription: true,
			},
		});

		if (!organization) {
			return new NextResponse("Organization not found", { status: 404 });
		}

		const subscription = organization.subscription
			? {
				id: organization.subscription.id,
				polarSubscriptionId: organization.subscription.polarSubscriptionId,
				status: organization.subscription.status,
				planType: organization.subscription.planType,
				blogEnabled: organization.subscription.blogEnabled,
				blogLimit: organization.subscription.blogLimit,
				customPortfolioLimit: organization.subscription.customPortfolioLimit,
				createdAt: organization.subscription.createdAt,
				updatedAt: organization.subscription.updatedAt,
			}
			: null;

		return NextResponse.json(subscription);
	} catch (error) {
		console.error("Error fetching organization subscription:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

// Polar: Create a new checkout session for organization subscription (stub)
export async function POST(req, { params }) {
	try {
		const authToken = await req.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;
		const { orgId } = params;

		if (!userId || !orgId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { planType } = await req.json(); // Expect planType in body

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
			customerId: orgId, // or email if required
			// Optionally pass success/cancel URLs
		});

		// Optionally, store session.id in Subscription for later verification
		await prisma.subscription.update({
			where: { organizationId: orgId },
			data: { polarSubscriptionId: session.id },
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Error creating Polar org checkout session:", error);
		return new NextResponse("Failed to create org checkout session", { status: 500 });
	}
}
