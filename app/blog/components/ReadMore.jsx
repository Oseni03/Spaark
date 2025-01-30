import React from "react";
import Image from "next/image";
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
					<div className="flex h-full flex-col overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
						<Image
							src={post.image}
							alt={post.title}
							width={400}
							height={200}
							className="w-full object-cover"
						/>
						<div className="flex flex-grow flex-col bg-white dark:bg-gray-800 p-4 transition-colors duration-300 ease-in-out hover:bg-gray-50">
							<h3 className="mb-2 text-xl font-semibold transition-colors duration-300 ease-in-out hover:text-blue-500">
								{post.title}
							</h3>
							<p className="mb-2 flex-grow text-gray-600 dark:text-gray-300">
								{post.description}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{post.date}
							</p>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
