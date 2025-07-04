import {
	addDomainToVercel,
	removeDomainFromVercelProject,
	validDomainRegex,
} from "@/lib/domains";
import { updatePortfolioDomain } from "@/services/portfolio";
import { logger } from "@/lib/utils";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/utils/constants";
import { prisma } from "@/lib/db";

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

		const { domain, portfolioId } = await req.json();

		if (!domain) {
			return NextResponse.json(
				{ success: false, error: "Missing domain" },
				{ status: 400 }
			);
		}

		if (!portfolioId) {
			return NextResponse.json(
				{ success: false, error: "Missing portfolio ID" },
				{ status: 400 }
			);
		}

		// Validate domain format
		if (!validDomainRegex.test(domain)) {
			return NextResponse.json(
				{ success: false, error: "Invalid domain format" },
				{ status: 400 }
			);
		}

		// Check if domain is the root domain
		if (domain.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
			return NextResponse.json(
				{
					success: false,
					error: `Cannot use ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} as your custom domain`,
				},
				{ status: 400 }
			);
		}

		// Check if domain is already in use by another portfolio
		const existingPortfolio = await prisma.portfolio.findFirst({
			where: {
				customDomain: domain,
				id: { not: portfolioId },
			},
		});

		if (existingPortfolio) {
			return NextResponse.json(
				{
					success: false,
					error: "This domain is already in use by another portfolio",
				},
				{ status: 400 }
			);
		}

		// Add domain to Vercel
		const projectId = process.env.PROJECT_ID_VERCEL;
		const vercelResponse = await addDomainToVercel(domain, projectId);
		logger.info("Vercel domain response:", vercelResponse);

		if (vercelResponse.error) {
			// Handle specific Vercel errors
			if (vercelResponse.error.code === "domain_already_exists") {
				return NextResponse.json(
					{
						success: false,
						error: "This domain is already configured in our system",
					},
					{ status: 400 }
				);
			}

			return NextResponse.json(
				{
					success: false,
					error:
						vercelResponse.error.message || "Failed to add domain",
				},
				{ status: 400 }
			);
		}

		// Update portfolio in database
		const dbResult = await updatePortfolioDomain(portfolioId, domain);
		if (dbResult.error) {
			logger.error("Database update error:", dbResult.error);
			// Try to remove domain from Vercel if database update fails
			await removeDomainFromVercelProject(domain);
			return NextResponse.json(
				{
					success: false,
					error: "Failed to save domain configuration",
				},
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			data: {
				domain,
				verification: vercelResponse.verification || [],
				message:
					"Domain added successfully! Please configure your DNS settings.",
			},
		});
	} catch (error) {
		logger.error("[DOMAINS_POST]", error);
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

		if (!portfolioId) {
			return NextResponse.json(
				{ success: false, error: "Missing portfolio ID parameter" },
				{ status: 400 }
			);
		}

		// Verify user owns this portfolio
		const portfolio = await prisma.portfolio.findFirst({
			where: {
				id: portfolioId,
				userId: userId,
			},
		});

		if (!portfolio) {
			return NextResponse.json(
				{
					success: false,
					error: "Portfolio not found or access denied",
				},
				{ status: 404 }
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

		// Remove custom domain from portfolio
		try {
			await prisma.portfolio.update({
				where: { id: portfolioId },
				data: { customDomain: null, domainVerified: false },
			});
		} catch (dbError) {
			logger.error("[DOMAINS_DELETE] Database update error:", dbError);
			return NextResponse.json(
				{
					success: false,
					error: "Failed to remove domain from database",
				},
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Domain removed successfully",
		});
	} catch (error) {
		logger.error("[DOMAINS_DELETE]", error);
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
