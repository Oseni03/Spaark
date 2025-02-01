import { createSlice } from "@reduxjs/toolkit";
import {
	createBlogInDatabase,
	updateBlogInDatabase,
	removeBlogFromDatabase,
	fetchBlogsForPortfolio,
	publishBlogInDatabase,
} from "../thunks/blog";

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
				state.items = action.payload;
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
				state.items.unshift(action.payload);
				state.loading = false;
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
				const index = state.items.findIndex(
					(blog) => blog.id === action.payload.id
				);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.loading = false;
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
			})
			// Publish blog
			.addCase(publishBlogInDatabase.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(publishBlogInDatabase.fulfilled, (state, action) => {
				const index = state.items.findIndex(
					(blog) => blog.id === action.payload.id
				);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.loading = false;
			})
			.addCase(publishBlogInDatabase.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.error || "Failed to publish blog";
			});
	},
});

export const { setBlogs, clearBlogs, updateFilters } = blogSlice.actions;
export default blogSlice.reducer;
