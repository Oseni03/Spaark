import { createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "@/lib/utils";
import { blogSchema, blogMetadataSchema } from "@/schema/sections/blog";
import { slugify } from "@/utils/text";
import {
	getBlogs as getBlogsAction,
	getBlog as getBlogAction,
	createBlog as createBlogAction,
	updateBlog as updateBlogAction,
	deleteBlog as deleteBlogAction,
	publishBlog as publishBlogAction,
} from "@/services/blog";

export const fetchBlogsForPortfolio = createAsyncThunk(
	"blogs/fetch",
	async (portfolioId, { rejectWithValue }) => {
		try {
			const blogs = await getBlogsAction(portfolioId);
			return blogs.map((blog) => blogSchema.parse(blog));
		} catch (error) {
			logger.error("Error fetching blogs:", error);
			return rejectWithValue({ error: error.message });
		}
	}
);

export const createBlogInDatabase = createAsyncThunk(
	"blogs/create",
	async ({ portfolioId, data }, { rejectWithValue }) => {
		try {
			// Validate metadata
			const metadata = blogMetadataSchema.parse({
				title: data.title,
				slug: slugify(data.title),
				featuredImage: data.featuredImage,
				excerpt: data.excerpt,
			});

			const blog = await createBlogAction({
				portfolioId,
				data: {
					...metadata,
					content: data.content,
					status: "draft",
				},
			});

			return blogSchema.parse(blog);
		} catch (error) {
			logger.error("Error creating blog:", error);
			return rejectWithValue({ error: error.message });
		}
	}
);

export const updateBlogInDatabase = createAsyncThunk(
	"blogs/update",
	async ({ blogId, portfolioId, data }, { rejectWithValue }) => {
		try {
			const metadata = blogMetadataSchema.parse({
				title: data.title,
				slug: slugify(data.title),
				featuredImage: data.featuredImage,
				excerpt: data.excerpt,
			});

			const blog = await updateBlogAction({
				blogId,
				portfolioId,
				data: {
					...metadata,
					content: data.content,
				},
			});

			return blogSchema.parse(blog);
		} catch (error) {
			logger.error("Error updating blog:", error);
			return rejectWithValue({ error: error.message });
		}
	}
);

export const removeBlogFromDatabase = createAsyncThunk(
	"blogs/remove",
	async ({ blogId, portfolioId }, { rejectWithValue }) => {
		try {
			await deleteBlogAction({ blogId, portfolioId });
			return { id: blogId };
		} catch (error) {
			logger.error("Error removing blog:", error);
			return rejectWithValue({ error: error.message });
		}
	}
);

export const publishBlogInDatabase = createAsyncThunk(
	"blogs/publish",
	async ({ blogId, portfolioId }, { rejectWithValue }) => {
		try {
			const blog = await publishBlogAction({ blogId, portfolioId });
			return blogSchema.parse(blog);
		} catch (error) {
			logger.error("Error publishing blog:", error);
			return rejectWithValue({ error: error.message });
		}
	}
);
