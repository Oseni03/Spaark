import { z } from "zod";
import { idSchema } from "../shared/id";
import { createId } from "@paralleldrive/cuid2";

// Schema for blog metadata
export const blogMetadataSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z.string(),
	excerpt: z.string().optional(),
	featuredImage: z.string().url("Invalid image URL").optional().nullable(),
	status: z.enum(["draft", "published"]).default("draft"),
	tags: z.array(z.string()).default([]),
});

// Schema for full blog post
export const blogSchema = z
	.object({
		id: idSchema,
		portfolioId: z.string(),
		authorId: z.string(),
		content: z.any(), // For rich text content
		publishedAt: z.date().nullable(),
		views: z.number().default(0),
		likes: z.number().default(0),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	.merge(blogMetadataSchema);

// Default values
export const defaultBlogMetadata = {
	title: "",
	slug: "",
	excerpt: "",
	content: null,
	featuredImage: null,
	status: "draft",
	tags: [],
};

export const defaultBlog = {
	...defaultBlogMetadata,
	id: createId(),
	views: 0,
	likes: 0,
	publishedAt: null,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};
