import {
	addDomainToVercel,
	removeDomainFromVercelProject,
	validDomainRegex,
} from "@/lib/domains";
import { logger } from "@/lib/utils";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/utils/constants";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
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

		const { domain } = await req.json();

		if (!domain) {
			return new NextResponse("Missing domain", { status: 400 });
		}

		if (domain.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
			return new NextResponse(
				`Cannot use ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} as your custom domain`,
				{ status: 400 }
			);
		}

		if (!validDomainRegex.test(domain)) {
			return new NextResponse("Invalid domain format", { status: 400 });
		}

		// Add domain to Vercel
		const vercelResponse = await addDomainToVercel(domain);
		if (vercelResponse.error) {
			return NextResponse.json(
				{ success: false, error: vercelResponse.error.message },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		logger.error("[DOMAINS_POST]", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Internal error",
				details:
					process.env.NODE_ENV === "development"
						? error.stack
						: undefined,
			},
			{ status: error.status || 500 }
		);
	}
}

export async function DELETE(req) {
	try {
		const authToken = req.cookies.get(COOKIE_NAME)?.value;
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
		const portfolioId = searchParams.get("portfolioId");

		if (!domain) {
			return NextResponse.json(
				{ success: false, error: "Missing domain parameter" },
				{ status: 400 }
			);
		}

		// Remove domain from Vercel
		const vercelResponse = await removeDomainFromVercelProject(domain);

		// Note: Vercel might return an error if domain doesn't exist, but we should still proceed
		// to remove it from our database
		if (
			vercelResponse.error &&
			vercelResponse.error.code !== "domain_not_found"
		) {
			logger.warn(
				"[DOMAINS_DELETE] Vercel removal warning:",
				vercelResponse.error
			);
		}

		// Remove custom domain from portfolio if portfolioId is provided
		if (portfolioId) {
			try {
				await prisma.portfolio.update({
					where: { id: portfolioId },
					data: { customDomain: null },
				});
			} catch (dbError) {
				logger.error(
					"[DOMAINS_DELETE] Database update error:",
					dbError
				);
				// Don't fail the request if database update fails
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		logger.error("[DOMAINS_DELETE]", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Internal error",
				details:
					process.env.NODE_ENV === "development"
						? error.stack
						: undefined,
			},
			{ status: error.status || 500 }
		);
	}
}
