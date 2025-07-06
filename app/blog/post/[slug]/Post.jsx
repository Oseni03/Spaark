import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@/components/blog/porttable-text";
import { TableOfContents } from "@/app/blog/components/TableOfContents";
import { TryProduct } from "../../components/TryProduct";
import { ReadMore } from "@/app/blog/components/ReadMore";
import { BlogWrapper } from "@/components/wrapper/blog-wrapper";

export function Post({ post }) {
	// Only create image builder if Sanity is configured
	let builder = null;
	if (
		process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
		process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		try {
			const { client } = require("@/sanity/lib/client");
			const imageUrlBuilder = require("@sanity/image-url").default;
			builder = imageUrlBuilder(client);
		} catch (error) {
			console.warn("Failed to create image builder:", error);
		}
	}

	const content = PortableText(post.body);

	// If no post data, show fallback
	if (!post) {
		return (
			<BlogWrapper>
				<div className="mx-auto max-w-screen-xl px-4 py-12 md:pt-16 lg:px-8">
					<div className="text-center">
						<h1 className="text-3xl font-medium text-gray-900 dark:text-gray-50 mb-4">
							Blog Post Not Available
						</h1>
						<p className="text-gray-700 dark:text-gray-200">
							This blog post is not available at the moment.
						</p>
					</div>
				</div>
			</BlogWrapper>
		);
	}

	return (
		<BlogWrapper>
			<article className="mx-auto max-w-screen-xl px-4 py-12 md:pt-16 lg:px-8">
				<div className="grid gap-12 md:grid-cols-[1fr,240px]">
					<main>
						<div>
							<header className="mx-auto max-w-2xl text-center mb-12">
								<h1 className="text-3xl font-medium text-gray-900 dark:text-gray-50 mb-4">
									{post.title}
								</h1>
								<p className="text-gray-700 dark:text-gray-200">
									{post.description}
								</p>
							</header>
							<div className="prose prose-gray dark:prose-invert mx-auto max-w-3xl">
								{post.mainImage && builder && (
									<Image
										src={builder
											.image(post.mainImage)
											.width(1200)
											.height(675)
											.url()}
										alt={post?.mainImage?.alt || post.title}
										width={1200}
										height={675}
										className="w-full h-auto mb-8"
									/>
								)}
								{content}
							</div>
						</div>
						<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
							<ReadMore />
						</div>
					</main>

					<aside className="hidden md:block space-y-8">
						<div className="sticky top-24">
							<div className="mb-8 space-y-1">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Written by
								</p>
								<div className="flex items-center">
									{post.authorImage && builder && (
										<Image
											src={builder
												.image(post.authorImage)
												.width(32)
												.height(32)
												.url()}
											alt={post.authorName ?? ""}
											className="mr-2 h-8 w-8 rounded-full"
											width={32}
											height={32}
										/>
									)}
									<div>
										<p className="font-medium text-gray-900 dark:text-gray-100">
											{post.authorName ?? "Oseni03"}
										</p>
										<Link
											href={`https://twitter.com/${post.authorTwitter || "Oseni03"}`}
											className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
											target="_blank"
										>
											@{post.authorTwitter || "Oseni03"}
										</Link>
									</div>
								</div>
							</div>

							{post.body && <TableOfContents body={post.body} />}
							<div className="mt-8">
								<TryProduct />
							</div>
						</div>
					</aside>
				</div>
			</article>
		</BlogWrapper>
	);
}
