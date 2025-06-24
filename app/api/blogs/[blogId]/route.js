import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { COOKIE_NAME } from "@/utils/constants";
import { logger } from "@/lib/utils";
import { checkBlogArticleCreationAuth } from "@/middleware/subscription-auth";

export async function PATCH(request, { params }) {
	try {
		const authToken = request.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;
		const { blogId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await request.json();
		const { status, ...otherUpdates } = body;

		// Get current blog
		const currentBlog = await prisma.blog.findUnique({
			where: { id: blogId },
			select: {
				authorId: true,
				status: true,
				portfolio: {
					select: { blogEnabled: true },
				},
			},
		});

		if (!currentBlog) {
			return NextResponse.json(
				{ error: "Blog not found" },
				{ status: 404 }
			);
		}

		if (currentBlog.authorId !== userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if portfolio has blog enabled
		if (!currentBlog.portfolio.blogEnabled) {
			return NextResponse.json(
				{ error: "Blog is not enabled for this portfolio" },
				{ status: 403 }
			);
		}

		// Check authorization for publishing articles
		if (status !== undefined && status !== currentBlog.status) {
			if (status === "published") {
				const authCheck = await checkBlogArticleCreationAuth(userId);

				if (!authCheck.allowed) {
					logger.warn("Blog article publishing blocked", {
						userId,
						blogId,
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
		}

		// Update blog
		const updatedBlog = await prisma.blog.update({
			where: { id: blogId },
			data: {
				...otherUpdates,
				...(status !== undefined && {
					status,
					...(status === "published" && { publishedAt: new Date() }),
				}),
			},
		});

		logger.info("Blog article updated successfully", {
			blogId,
			userId,
			status,
			...(status === "published" && {
				remainingArticles: authCheck?.details?.remaining - 1,
			}),
		});

		return NextResponse.json(updatedBlog);
	} catch (error) {
		logger.error("Error updating blog article:", error);
		return NextResponse.json(
			{ error: "Failed to update blog article" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const authToken = request.cookies.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		const userId = decodedToken?.uid;
		const { blogId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if blog belongs to user
		const blog = await prisma.blog.findUnique({
			where: { id: blogId },
			select: { authorId: true },
		});

		if (!blog) {
			return NextResponse.json(
				{ error: "Blog not found" },
				{ status: 404 }
			);
		}

		if (blog.authorId !== userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Delete blog
		await prisma.blog.delete({
			where: { id: blogId },
		});

		logger.info("Blog article deleted successfully", {
			blogId,
			userId,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		logger.error("Error deleting blog article:", error);
		return NextResponse.json(
			{ error: "Failed to delete blog article" },
			{ status: 500 }
		);
	}
}
