"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { getBlogPost } from "@/services/blog";
import { getPortfolioFromSlug } from "@/services/portfolio";
import { BlogPostSkeleton } from "@/components/blog/blog-post-skeleton";
import NotFound from "@/app/not-found";
import { BlogPost } from "@/components/blog/blog-post";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Head from "next/head";

export default function Page() {
	const { slug, subdomain } = useParams();
	const router = useRouter();
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
		<>
			<Head>
				<title>{`${post.title} | ${portfolio.basics?.name || "Blog"}`}</title>
				<meta name="description" content={post.excerpt || post.title} />
				<meta property="og:title" content={post.title} />
				<meta
					property="og:description"
					content={post.excerpt || post.title}
				/>
				{post.featuredImage && (
					<meta property="og:image" content={post.featuredImage} />
				)}
			</Head>

			<div className="space-y-4">
				<Button
					variant="ghost"
					className="flex items-center gap-2 mt-8"
					onClick={() => router.back()}
				>
					<ChevronLeft className="h-4 w-4" />
					Back to Blog
				</Button>

				<BlogPost
					title={post.title}
					excerpt={post.excerpt}
					featuredImage={post.featuredImage}
					date={post.publishedAt}
					author={{
						name: portfolio.basics?.name || "Anonymous",
						image: portfolio.basics?.picture,
					}}
					content={contentHtml}
				/>
			</div>
		</>
	);
}
