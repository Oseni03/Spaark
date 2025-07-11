import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/utils";
import { headers } from "next/headers";

export async function GET(request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});
		const userId = session?.user?.id;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Get user with subscription details
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				subscription: true,
				portfolios: {
					where: { isLive: true },
					select: {
						id: true,
						isLive: true,
					},
				},
				blogs: {
					where: { status: "published" },
					select: {
						id: true,
						status: true,
					},
				},
			},
		});

		if (!user) {
			return new NextResponse("User not found", { status: 404 });
		}

		// Calculate current usage - only count live portfolios and published articles
		const activePortfolios = user.portfolios.length; // Already filtered to live only
		const publishedArticles = user.blogs.length; // Already filtered to published only

		const subscriptionData = {
			...user.subscription,
			usage: {
				portfolios: {
					current: activePortfolios,
					limit:
						user.subscription?.customPortfolioLimit ||
						user.subscription?.portfolioLimit ||
						0,
				},
				articles: {
					current: publishedArticles,
					limit: user.subscription?.blogLimit || 0,
				},
			},
		};

		return NextResponse.json(subscriptionData);
	} catch (error) {
		logger.error("Error fetching user subscription:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
