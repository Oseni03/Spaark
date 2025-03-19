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
		<div className="grid gap-4 md:grid-cols-3">
			{blogPosts.data.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/post/${post.slug}`}
					className="block h-full"
				>
					<div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400">
						<div className="flex flex-grow flex-col bg-white dark:bg-gray-800 p-4 transition-colors duration-300 ease-in-out">
							<div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-purple-500 mb-3" />
							<h3 className="mb-2 text-lg font-normal transition-colors duration-300 ease-in-out hover:text-blue-500">
								{post.title}
							</h3>
							<p className="mb-3 flex-grow text-sm text-gray-600 dark:text-gray-300">
								{post.description}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{post.date}
							</p>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
