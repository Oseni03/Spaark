import React from "react";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { recentPostsQuery } from "@/sanity/lib/queries";
import { logger } from "@/lib/utils";

export async function ReadMore() {
	const blogPosts = await sanityFetch({
		query: recentPostsQuery,
		tags: ["post"],
	});

	logger.info("Fetched blog posts:", blogPosts);
	return (
		<div className="grid gap-6 md:grid-cols-3">
			{blogPosts.data.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/post/${post.slug}`}
					className="group block"
				>
					<div className="relative space-y-2 rounded-lg border border-gray-100 dark:border-gray-800 p-4 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<div className="h-px w-8 bg-gradient-to-r from-blue-500/80 to-purple-500/80" />
						<h3 className="text-base font-normal text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400">
							{post.title}
						</h3>
						<p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
							{post.description}
						</p>
						<time className="block text-xs text-gray-500 dark:text-gray-400">
							{post.date}
						</time>
					</div>
				</Link>
			))}
		</div>
	);
}
