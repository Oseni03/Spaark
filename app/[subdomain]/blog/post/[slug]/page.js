"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatDate } from "@/lib/utils";
import { getBlogPost } from "@/services/blog";
import { getPortfolioFromSlug } from "@/lib/blog-utils";
import BlogPostSkeleton from "../../../components/blog-post-skeleton";
import NotFound from "@/app/not-found";

const BlogPost = ({ title, date, author, authorHandle, content }) => {
	return (
		<article className="max-w-4xl mx-auto px-6 py-12">
			<div className="text-center mb-12">
				<div className="inline-block mb-6">
					<img
						src="/api/placeholder/48/48"
						alt="Post icon"
						className="w-12 h-12"
					/>
				</div>
				<h1 className="text-4xl font-bold mb-8">{title}</h1>
			</div>

			<div className="mb-12">
				<div className="flex items-center gap-3 text-gray-600 mb-6">
					<span>{date}</span>
					<div className="flex items-center gap-2">
						<img
							src="/api/placeholder/24/24"
							alt={author}
							className="w-6 h-6 rounded-full"
						/>
						<span>{authorHandle}</span>
					</div>
				</div>
			</div>

			<div
				className="prose prose-lg max-w-none dark:prose-invert"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</article>
	);
};

export default function BlogPostPage() {
	const { slug, subdomain } = useParams();
	const portfolioContext = usePortfolio();
	const [post, setPost] = useState(null);
	const [portfolio, setPortfolio] = useState(portfolioContext?.portfolio);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function initializeData() {
			try {
				// If we don't have portfolio data from context, fetch it
				if (!portfolio) {
					const portfolioResult =
						await getPortfolioFromSlug(subdomain);
					if (!portfolioResult.success) {
						setError("Portfolio not found");
						return;
					}
					setPortfolio(portfolioResult.data.portfolio);
				}

				// Only fetch post if we have portfolio data and blog is enabled
				if (portfolio?.blogEnabled) {
					const result = await getBlogPost(portfolio.id, slug);
					if (result.success) {
						setPost(result.data);
					} else {
						setError("Post not found");
					}
				} else {
					setError("Blog not enabled");
				}
			} catch (error) {
				console.error("Error:", error);
				setError("An error occurred");
			} finally {
				setIsLoading(false);
			}
		}

		initializeData();
	}, [slug, subdomain, portfolio]);

	if (isLoading) {
		return <BlogPostSkeleton />;
	}

	if (error || !post) {
		return NotFound();
	}

	const contentHtml =
		typeof post.content === "string"
			? post.content
			: JSON.stringify(post.content);

	return (
		<BlogPost
			title={post.title}
			date={formatDate(post.publishedAt)}
			author={portfolio.basics?.name || "Anonymous"}
			authorHandle={portfolio.basics?.headline || "Author"}
			content={contentHtml}
		/>
	);
}
