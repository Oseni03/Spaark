import { createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "@/lib/utils";
import { blogSchema } from "@/schema/sections/blog";
import {
	getBlogsByPortfolio as getBlogsAction,
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
			if (!portfolioId) {
				return rejectWithValue({ error: "Portfolio ID is required" });
			}

			const blog = await createBlogAction({
				portfolioId,
				data: {
					...data,
					status: "draft",
				},
			});

			return blog;
		} catch (error) {
			logger.error("Error creating blog:", error);
			return rejectWithValue({
				error: error.message || "Failed to create blog post",
			});
		}
	}
);

export const updateBlogInDatabase = createAsyncThunk(
	"blogs/update",
	async ({ blogId, portfolioId, data }, { rejectWithValue }) => {
		try {
			const blog = await updateBlogAction({
				blogId,
				portfolioId,
				data,
			});

			return blog;
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
