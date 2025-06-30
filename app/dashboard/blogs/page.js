"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreateBlogCard } from "../components/create-blog-card";
import { BaseCard } from "../components/base-card";
import { BlogCard } from "../components/blog-card";
import { logger } from "@/lib/utils";

function Page() {
	const [loading, setLoading] = useState(false);
	const [blogs, setBlogs] = useState([]);
	const [sortedBlogs, setSortedBlogs] = useState([]);

	useEffect(() => {
		const fetchBlogs = async () => {
			// Fetch blogs
			const startTime = performance.now();
			logger.info("Starting blogs data fetch");

			try {
				setLoading(true);
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

				if (blogs?.error) {
					throw new Error(blogs.error);
				}

				logger.info("Updating blogs in store", {
					count: blogs.data.length,
				});
				setBlogs(blogs.data);

				const endTime = performance.now();
				logger.info("Blogs data fetch completed", {
					duration: `${(endTime - startTime).toFixed(2)}ms`,
				});
			} catch (error) {
				logger.error(`Error fetching blogs`, error);
				return [];
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []);

	useEffect(() => {
		// Create a mutable copy of the blogs array before sorting
		setSortedBlogs(
			[...blogs].sort((a, b) => {
				// Apply your sorting logic here
				return new Date(b.updatedAt) - new Date(a.updatedAt);
			})
		);
	}, [blogs]);

	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			<motion.div
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
			>
				<CreateBlogCard />
			</motion.div>

			{loading &&
				Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="duration-300 animate-in fade-in"
						style={{
							animationFillMode: "backwards",
							animationDelay: `${i * 300}ms`,
						}}
					>
						<BaseCard />
					</div>
				))}

			{blogs && (
				<AnimatePresence>
					{sortedBlogs.map((blog, index) => (
						<motion.div
							key={blog.id}
							layout
							initial={{ opacity: 0, x: -50 }}
							animate={{
								opacity: 1,
								x: 0,
								transition: { delay: (index + 2) * 0.1 },
							}}
							exit={{
								opacity: 0,
								filter: "blur(8px)",
								transition: { duration: 0.5 },
							}}
						>
							<BlogCard blog={blog} />
						</motion.div>
					))}
				</AnimatePresence>
			)}
		</div>
	);
}

export default Page;
