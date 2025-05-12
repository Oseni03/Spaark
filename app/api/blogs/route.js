import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import { getBlogsByAuthor, getBlogsByPortfolio } from "@/services/blog";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { COOKIE_NAME } from "@/utils/constants";

const getCorsHeaders = (origin) => {
	const allowedOrigins = [
		process.env.NEXT_PUBLIC_APP_URL,
		`https://*.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
	];

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
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Max-Age": "86400",
		Vary: "Origin",
	};
};

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
	const requestId = Math.random().toString(36).substring(7);

	logger.info("Blogs API request received", {
		requestId,
		method: "GET",
		origin,
		url: req.url,
	});

	try {
		const { searchParams } = new URL(req.url);
		const portfolioId = searchParams.get("portfolioId");
		const authToken = await req.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;

		if (!portfolioId && !userId) {
			logger.error("Unauthorized request", { requestId });
			return createErrorResponse(401, "Unauthorized", origin);
		}

		logger.info("Fetching blogs", {
			requestId,
			portfolioId,
			userId,
		});

		let blogs;

		if (portfolioId) {
			blogs = await getBlogsByPortfolio(portfolioId);
		} else {
			blogs = await getBlogsByAuthor(userId);
		}

		return new NextResponse(JSON.stringify({ blogs }), {
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
		logger.error("Error in blogs API", {
			requestId,
			error: error.message,
			stack: error.stack,
		});
		return createErrorResponse(500, "Failed to fetch blogs", origin);
	}
}

export async function OPTIONS(req) {
	const origin = req.headers.get("origin") || "";
	return new NextResponse(null, {
		status: 204,
		headers: getCorsHeaders(origin),
	});
}

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};
