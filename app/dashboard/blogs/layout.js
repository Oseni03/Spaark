"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logger } from "@/lib/utils";
import { setBlogs } from "@/redux/features/blogSlice";

function BlogLayout({ children }) {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchBlogs = async () => {
			// Fetch blogs
			const startTime = performance.now();
			logger.info("Starting blogs data fetch");

			try {
				const response = await fetch(`/api/blogs`);

				if (!response.ok) {
					logger.error("Blog API request failed", {
						status: response.status,
						statusText: response.statusText,
					});
					throw new Error(`Failed to fetch blogs for user`);
				}

				const { blogs } = await response.json();
				logger.info("Blog data received from API", {
					count: blogs?.data?.length || 0,
				});

				if (blogs?.data) {
					logger.info("Updating blogs in store", {
						count: blogs.data.length,
					});
					dispatch(setBlogs(blogs.data));
				}

				const endTime = performance.now();
				logger.info("Blogs data fetch completed", {
					duration: `${(endTime - startTime).toFixed(2)}ms`,
				});
			} catch (error) {
				logger.error(`Error fetching blogs`, error);
				return [];
			}
		};

		fetchBlogs();
	}, [dispatch]);
	return <>{children}</>;
}

export default BlogLayout;
