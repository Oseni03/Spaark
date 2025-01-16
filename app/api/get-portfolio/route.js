import { NextResponse } from "next/server";
import { getPortfolios } from "@/services/portfolio";
import { getBasics } from "@/services/basics";
import { getCertifications } from "@/services/certification";
import { getEducations } from "@/services/education";
import { getExperiences } from "@/services/experience";
import { getProfiles } from "@/services/profile";
import { getSkills } from "@/services/skill";
import { auth } from "@clerk/nextjs/server";
import { getProjects } from "@/services/project";
import { getHackathons } from "@/services/hackathon";
import { logger } from "@/lib/utils";

// Helper function to get CORS headers
const getCorsHeaders = (origin) => {
	const allowedOrigins = [
		process.env.NEXT_PUBLIC_APP_URL,
		`https://*.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		// Add any other allowed origins
	];

	// Check if the origin is allowed
	const isAllowedOrigin = allowedOrigins.some((allowed) => {
		if (allowed.includes("*")) {
			const pattern = allowed.replace("*", ".*");
			return new RegExp(pattern).test(origin);
		}
		return allowed === origin;
	});

	return {
		"Access-Control-Allow-Origin": isAllowedOrigin
			? origin
			: allowedOrigins[0],
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers":
			"Content-Type, Authorization, x-clerk-auth-status, x-clerk-auth-reason",
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Max-Age": "86400", // 24 hours
		Vary: "Origin",
	};
};

// Helper function to create error response
const createErrorResponse = (status, message, origin) => {
	return new NextResponse(JSON.stringify({ error: message }), {
		status,
		headers: {
			"Content-Type": "application/json",
			...getCorsHeaders(origin),
		},
	});
};

export async function GET(req) {
	const origin = req.headers.get("origin") || "";

	try {
		const { searchParams } = new URL(req.url);
		let userId = searchParams.get("userId");

		if (!userId) {
			const { userId: authenticatedUserId } = await auth();

			if (!authenticatedUserId) {
				return createErrorResponse(401, "Unauthorized", origin);
			}

			userId = authenticatedUserId;
		}

		const portfolios = await getPortfolios(userId);
		if (!portfolios.success) {
			return createErrorResponse(
				400,
				portfolios.error || "Error getting user portfolios",
				origin
			);
		}

		const portfolioDataPromises = portfolios.data.map(async (portfolio) => {
			const portfolioId = portfolio.id;

			const results = await Promise.allSettled([
				getBasics(portfolioId),
				getProfiles(portfolioId),
				getExperiences(portfolioId),
				getEducations(portfolioId),
				getCertifications(portfolioId),
				getSkills(portfolioId),
				getProjects(portfolioId),
				getHackathons(portfolioId),
			]);

			const [
				basics,
				profiles,
				experiences,
				educations,
				certifications,
				skills,
				projects,
				hackathons,
			] = results.map((result) =>
				result.status === "fulfilled" ? result.value : null
			);

			return {
				portfolio,
				basics,
				profiles,
				experiences,
				educations,
				certifications,
				skills,
				projects,
				hackathons,
			};
		});

		const portfolioData = await Promise.all(portfolioDataPromises);

		return new NextResponse(JSON.stringify({ portfolios: portfolioData }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				...getCorsHeaders(origin),
				"Cache-Control": "private, no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
			},
		});
	} catch (error) {
		logger.error("Error fetching user data:", error);
		return createErrorResponse(500, "Failed to fetch user data", origin);
	}
}

export async function OPTIONS(req) {
	const origin = req.headers.get("origin") || "";

	// Handle preflight requests
	return new NextResponse(null, {
		status: 204,
		headers: getCorsHeaders(origin),
	});
}

// Configure the API route
export const config = {
	api: {
		bodyParser: false, // Disable body parsing, consume as stream
		externalResolver: true, // Enable external resolving for Clerk auth
	},
};
