"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { blogSchema, blogMetadataSchema } from "@/schema/sections/blog";
import { logger } from "@/lib/utils";
import { slugify } from "@/utils/text";

export async function getBlogs(portfolioId) {
	return withErrorHandling(async () => {
		const blogs = await prisma.blog.findMany({
			where: { portfolioId },
			orderBy: { updatedAt: "desc" },
			include: {
				tags: true,
				portfolio: true,
				views: true,
				likes: true,
			},
		});

		return blogs.map((blog) => blogSchema.parse(blog));
	});
}

export async function getBlog(blogId, portfolioId) {
	return withErrorHandling(async () => {
		const blog = await prisma.blog.findFirst({
			where: {
				id: blogId,
				portfolioId,
			},
			include: {
				portfolio: true,
				tags: true,
				views: true,
				likes: true,
			},
		});

		if (!blog) {
			throw new Error("Blog not found");
		}

		return blogSchema.parse(blog);
	});
}

export async function createBlog({ portfolioId, data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Validate metadata
		const metadata = blogMetadataSchema.parse({
			title: data.title,
			slug: slugify(data.title),
			featuredImage: data.featuredImage,
			excerpt: data.excerpt,
		});

		const blog = await prisma.blog.create({
			data: {
				...metadata,
				content: data.content,
				authorId: userId,
				portfolio: { connect: { id: portfolioId } },
				tags: {
					connectOrCreate: (data.tags || []).map((tag) => ({
						where: { name: tag },
						create: { name: tag, slug: slugify(tag) },
					})),
				},
			},
			include: {
				tags: true,
				portfolio: true,
				views: true,
				likes: true,
			},
		});

		revalidatePath("/dashboard/blogs");
		return blogSchema.parse(blog);
	});
}

export async function updateBlog({ blogId, portfolioId, data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const metadata = blogMetadataSchema.parse({
			title: data.title,
			slug: slugify(data.title),
			featuredImage: data.featuredImage,
			excerpt: data.excerpt,
		});

		const blog = await prisma.blog.update({
			where: {
				id: blogId,
				portfolioId,
			},
			data: {
				...metadata,
				content: data.content,
				tags: {
					set: [], // Remove existing tags
					connectOrCreate: (data.tags || []).map((tag) => ({
						where: { name: tag },
						create: { name: tag, slug: slugify(tag) },
					})),
				},
			},
			include: {
				tags: true,
				portfolio: true,
				views: true,
				likes: true,
			},
		});

		revalidatePath("/dashboard/blogs");
		return blogSchema.parse(blog);
	});
}

export async function deleteBlog({ blogId, portfolioId }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		await prisma.blog.delete({
			where: {
				id: blogId,
				portfolioId,
			},
		});

		revalidatePath("/dashboard/blogs");
		return { id: blogId };
	});
}

export async function publishBlog({ blogId, portfolioId }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const blog = await prisma.blog.update({
			where: {
				id: blogId,
				portfolioId,
			},
			data: {
				status: "published",
				publishedAt: new Date(),
			},
			include: {
				tags: true,
				portfolio: true,
				views: true,
				likes: true,
			},
		});

		revalidatePath("/dashboard/blogs");
		return blogSchema.parse(blog);
	});
}

export async function getBlogPosts(portfolioId) {
	return withErrorHandling(async () => {
		const posts = await prisma.blog.findMany({
			where: {
				portfolioId,
				status: "published",
			},
			orderBy: {
				publishedAt: "desc",
			},
			include: {
				tags: true,
			},
		});

		return posts;
	});
}

export async function getBlogPost(portfolioId, slug) {
	return withErrorHandling(async () => {
		const post = await prisma.blog.findFirst({
			where: {
				portfolioId,
				slug,
				status: "published",
			},
			include: {
				tags: true,
			},
		});

		if (!post) {
			throw new Error("Post not found");
		}

		// Increment view count
		await prisma.blog.update({
			where: { id: post.id },
			data: { views: { increment: 1 } },
		});

		return post;
	});
}
