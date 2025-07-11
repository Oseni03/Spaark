import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { COOKIE_NAME } from "@/utils/constants";

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
	// TODO: Implement Polar checkout session creation for organization
	return NextResponse.json({ message: "Polar org checkout session creation not implemented yet." }, { status: 501 });
}
