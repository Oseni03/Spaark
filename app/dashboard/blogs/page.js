"use client";

import React from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { CreateBlogCard } from "../components/create-blog-card";
import { BaseCard } from "../components/base-card";
import { BlogCard } from "../components/blog-card";
import { sortByDate } from "@/lib/utils";

function Page() {
	const { items: blogs, loading } = useSelector((state) => state.blogs);

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
					{blogs
						.sort((a, b) => sortByDate(a, b, "updatedAt"))
						.map((blog, index) => (
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
