"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { blogSchema } from "@/schema/sections/blog";
import { slugify } from "@/utils/text";
import { COOKIE_NAME } from "@/utils/constants";

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

const serializeDates = (blog) => ({
	...blog,
	publishedAt: blog.publishedAt?.toISOString(),
	createdAt: blog.createdAt?.toISOString(),
	updatedAt: blog.updatedAt?.toISOString(),
});

// Keep tags as objects when processing blog data
const processBlog = (blog) => {
	const parsed = blogSchema.parse(blog);
	return serializeDates(parsed);
};

export async function getBlogs(portfolioId) {
	return withErrorHandling(async () => {
		const blogs = await prisma.blog.findMany({
			where: { portfolioId },
			orderBy: { updatedAt: "desc" },
			select,
		});
		return blogs.map(processBlog);
	});
}

// Update other functions to use processBlog instead of direct serialization
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

		return processBlog(blog);
	});
}

export async function createBlog({ portfolioId, data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) throw new Error("Unauthorized");
		if (!portfolioId) throw new Error("Portfolio ID is required");

		const userId = decodedToken.uid;

		// Separate tags from main data
		const { tags = [], ...blogData } = data;

		const blog = await prisma.blog.create({
			data: {
				...blogData,
				authorId: userId,
				portfolio: { connect: { id: portfolioId } },
				tags: {
					connectOrCreate: tags.map((tag) => ({
						where: {
							slug: tag.slug || slugify(tag.name),
						},
						create: {
							name: tag.name,
							slug: tag.slug || slugify(tag.name),
						},
					})),
				},
			},
			select,
		});

		revalidatePath("/dashboard/blogs");
		return processBlog(blog);
	});
}

export async function updateBlog({ blogId, portfolioId, data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) throw new Error("Unauthorized");

		// Separate tags from main data
		const { tags = [], ...blogData } = data;

		const blog = await prisma.blog.update({
			where: {
				id: blogId,
				portfolioId,
			},
			data: {
				...blogData,
				tags: {
					set: [], // Clear existing tags
					connectOrCreate: tags.map((tag) => ({
						where: {
							slug: tag.slug || slugify(tag.name),
						},
						create: {
							name: tag.name,
							slug: tag.slug || slugify(tag.name),
						},
					})),
				},
			},
			select,
		});

		revalidatePath("/dashboard/blogs");
		return processBlog(blog);
	});
}

export async function deleteBlog({ blogId, portfolioId }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) throw new Error("Unauthorized");

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

		return posts.map(processBlog);
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

		return processBlog(post);
	});
}
