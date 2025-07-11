import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import { getBlogsByAuthor, getBlogsByPortfolio } from "@/services/blog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { checkBlogArticleCreationAuth } from "@/middleware/subscription-auth";

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
		const session = await auth.api.getSession({
			headers: await headers()
		});
		const userId = session?.user?.id;

		if (!userId) {
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

export async function POST(request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});
		const userId = session?.user?.id;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const {
			title,
			slug,
			portfolioId,
			content,
			excerpt,
			featuredImage,
			status = "draft",
		} = body;

		if (!title || !slug || !portfolioId) {
			return NextResponse.json(
				{ error: "Title, slug, and portfolioId are required" },
				{ status: 400 }
			);
		}

		// Check if portfolio belongs to user and has blog enabled
		const portfolio = await prisma.portfolio.findUnique({
			where: { id: portfolioId },
			select: { userId: true, blogEnabled: true },
		});

		if (!portfolio) {
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		if (portfolio.userId !== userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!portfolio.blogEnabled) {
			return NextResponse.json(
				{ error: "Blog is not enabled for this portfolio" },
				{ status: 403 }
			);
		}

		// Check subscription authorization for publishing articles
		if (status === "published") {
			const authCheck = await checkBlogArticleCreationAuth(userId);

			if (!authCheck.allowed) {
				logger.warn("Blog article creation blocked", {
					userId,
					portfolioId,
					reason: authCheck.reason,
					details: authCheck.details,
				});

				return NextResponse.json(
					{
						error: authCheck.reason,
						details: authCheck.details,
						upgradeRequired: true,
					},
					{ status: 403 }
				);
			}
		}

		// Check if slug already exists
		const existingBlog = await prisma.blog.findUnique({
			where: { slug },
		});

		if (existingBlog) {
			return NextResponse.json(
				{ error: "Blog with this slug already exists" },
				{ status: 409 }
			);
		}

		// Create blog article
		const blog = await prisma.blog.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				featuredImage,
				status,
				portfolioId,
				authorId: userId,
				...(status === "published" && { publishedAt: new Date() }),
			},
		});

		logger.info("Blog article created successfully", {
			blogId: blog.id,
			userId,
			portfolioId,
			status,
			...(status === "published" && {
				remainingArticles: authCheck?.details?.remaining - 1,
			}),
		});

		return NextResponse.json(blog);
	} catch (error) {
		logger.error("Error creating blog article:", error);
		return NextResponse.json(
			{ error: "Failed to create blog article" },
			{ status: 500 }
		);
	}
}
