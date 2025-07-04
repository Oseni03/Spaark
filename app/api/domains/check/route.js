import { getDomainResponse, getConfigResponse } from "@/lib/domains";
import { markDomainVerified } from "@/services/portfolio";
import { logger } from "@/lib/utils";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/utils/constants";
import { prisma } from "@/lib/db";

export async function GET(req) {
	try {
		const authToken = await req.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(req.url);
		const domain = searchParams.get("domain");

		if (!domain) {
			return NextResponse.json(
				{ success: false, error: "Missing domain" },
				{ status: 400 }
			);
		}

		// Check if domain is already verified in database
		const portfolio = await prisma.portfolio.findFirst({
			where: {
				customDomain: domain,
				userId: userId,
			},
			select: { domainVerified: true },
		});

		// If domain is already verified, return success without external check
		if (portfolio?.domainVerified) {
			return NextResponse.json({
				success: true,
				data: {
					domain: { verified: true },
					config: { misconfigured: false },
				},
			});
		}

		// Check domain status with external services
		const [domainData, configData] = await Promise.all([
			getDomainResponse(domain),
			getConfigResponse(domain),
		]);

		return NextResponse.json({
			success: true,
			data: {
				domain: domainData,
				config: configData,
			},
		});
	} catch (error) {
		logger.error("[DOMAINS_VERIFY]", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Internal server error",
				details:
					process.env.NODE_ENV === "development"
						? error.stack
						: undefined,
			},
			{ status: 500 }
		);
	}
}
