"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { blogSchema } from "@/schema/sections/blog";
import { slugify } from "@/utils/text";

const select = {
	id: true,
	title: true,
	slug: true,
	excerpt: true,
	content: true,
	featuredImage: true,
	status: true,
	publishedAt: true,
	createdAt: true,
	updatedAt: true,
	views: true,
	likes: true,
	portfolioId: true,
	authorId: true,
	tags: {
		select: {
			id: true,
			name: true,
			slug: true,
		},
	},
};

export async function getBlogs(portfolioId) {
	return withErrorHandling(async () => {
		const blogs = await prisma.blog.findMany({
			where: { portfolioId },
			orderBy: { updatedAt: "desc" },
			select,
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
			select,
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
		if (!userId) throw new Error("Unauthorized");
		if (!portfolioId) throw new Error("Portfolio ID is required");

		const blog = await prisma.blog.create({
			data: {
				...data,
				authorId: userId,
				portfolio: { connect: { id: portfolioId } },
				tags: {
					connectOrCreate: (data.tags || []).map((tag) => ({
						where: { name: tag },
						create: { name: tag, slug: slugify(tag) },
					})),
				},
			},
			select,
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

		const blog = await prisma.blog.update({
			where: {
				id: blogId,
				portfolioId,
			},
			data: {
				...data,
				tags: {
					set: [], // Remove existing tags
					connectOrCreate: (data.tags || []).map((tag) => ({
						where: { name: tag },
						create: { name: tag, slug: slugify(tag) },
					})),
				},
			},
			select,
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
			select,
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
			select,
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
			select,
		});

		if (!post) throw new Error("Post not found");

		await prisma.blog.update({
			where: { id: post.id },
			data: { views: { increment: 1 } },
		});

		return blogSchema.parse(post);
	});
}
