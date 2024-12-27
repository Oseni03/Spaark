import { NextResponse } from "next/server";
import { getUser, getUserBasics } from "@/services/user";
import { getUserCertifications } from "@/services/certification";
import { getUserEducations } from "@/services/education";
import { getUserExperiences } from "@/services/experience";
import { getUserProfiles } from "@/services/profile";
import { getUserSkills } from "@/services/skill";
import { auth } from "@clerk/nextjs/server";
import { getUserProjects } from "@/services/project";
import { getUserHackathons } from "@/services/hackathon";
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

		const results = await Promise.allSettled([
			getUserBasics(userId),
			getUserProfiles(userId),
			getUserExperiences(userId),
			getUserEducations(userId),
			getUserCertifications(userId),
			getUserSkills(userId),
			getUserProjects(userId),
			getUserHackathons(userId),
			getUser(userId),
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
			user,
		] = results.map((result) =>
			result.status === "fulfilled" ? result.value : null
		);

		const responseData = {
			basics,
			profiles,
			experiences,
			educations,
			certifications,
			skills,
			projects,
			hackathons,
			user,
		};

		return new NextResponse(JSON.stringify(responseData), {
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
