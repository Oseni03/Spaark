import { NextResponse } from "next/server";
import { getPortfolios } from "@/services/portfolio";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils";
import { getUser } from "@/services/user";

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

		// Get both userId and orgId from auth
		const { userId: authenticatedUserId, orgId } = await auth();

		if (!userId && !authenticatedUserId) {
			return createErrorResponse(401, "Unauthorized", origin);
		}

		userId = userId || authenticatedUserId;

		// Get portfolios for both user and organization if available
		const portfoliosPromise = getPortfolios(userId, orgId);
		const userPromise = getUser(userId);

		const [user, portfolios] = await Promise.all([
			userPromise,
			portfoliosPromise,
		]);

		if (!user) {
			return createErrorResponse(404, "User not found", origin);
		}

		if (!portfolios.success) {
			return createErrorResponse(
				400,
				portfolios.error || "Error getting portfolios",
				origin
			);
		}

		return new NextResponse(JSON.stringify({ portfolios, user }), {
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
		logger.error("Error fetching data:", error);
		return createErrorResponse(500, "Failed to fetch data", origin);
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
