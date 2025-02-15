import { createSlice } from "@reduxjs/toolkit";
import {
	createBlogInDatabase,
	updateBlogInDatabase,
	removeBlogFromDatabase,
	fetchBlogsForPortfolio,
} from "../thunks/blog";
import { logger } from "@/lib/utils";

const initialState = {
	items: [],
	loading: false,
	error: null,
	filters: {
		status: "all", // all, draft, published
		search: "",
		tags: [],
	},
};

export const blogSlice = createSlice({
	name: "blogs",
	initialState,
	reducers: {
		setBlogs: (state, action) => {
			state.items = action.payload;
			state.loading = false;
			state.error = null;
		},
		clearBlogs: (state) => {
			state.items = [];
			state.loading = false;
			state.error = null;
		},
		updateFilters: (state, action) => {
			state.filters = { ...state.filters, ...action.payload };
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch blogs
			.addCase(fetchBlogsForPortfolio.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchBlogsForPortfolio.fulfilled, (state, action) => {
				const { data, error } = action.payload;
				if (error) {
					logger.error("Blog fetch failed:", {
						error,
						state: { ...state, items: state.items.length },
					});
					state.error = error;
					return;
				}

				logger.info("Blogs fetched successfully:", {
					count: data.length,
					state: { loading: state.loading, hasError: !!state.error },
				});

				state.items = data;
				state.loading = false;
			})
			.addCase(fetchBlogsForPortfolio.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.error || "Failed to fetch blogs";
			})
			// Create blog
			.addCase(createBlogInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createBlogInDatabase.fulfilled, (state, action) => {
				const { data, error } = action.payload;
				state.loading = false;

				if (error) {
					logger.error("Error creating blog:", error);
					state.error = error;
					return;
				}

				logger.info("Blog created successfully:", data);
				state.items.unshift(data);
			})
			.addCase(createBlogInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.error || "Failed to create blog";
			})
			// Update blog
			.addCase(updateBlogInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateBlogInDatabase.fulfilled, (state, action) => {
				const { data, error } = action.payload;
				state.loading = false;

				if (!data) return;

				if (error) {
					state.error = error || "Failed to update blog";
					return;
				}

				const index = state.items.findIndex(
					(blog) => blog.id === data.id
				);

				if (index !== -1) {
					state.items[index] = data;
				}
			})
			.addCase(updateBlogInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.error || "Failed to update blog";
			})
			// Remove blog
			.addCase(removeBlogFromDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeBlogFromDatabase.fulfilled, (state, action) => {
				state.items = state.items.filter(
					(blog) => blog.id !== action.payload.id
				);
				state.loading = false;
			})
			.addCase(removeBlogFromDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.error || "Failed to remove blog";
			});
	},
});

export const { setBlogs, clearBlogs, updateFilters } = blogSlice.actions;
export default blogSlice.reducer;
