"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { getBlogPosts } from "@/services/blog";
import { getPortfolioFromSlug } from "@/services/portfolio";
import BlogListSkeleton from "@/components/blog/blog-list-skeleton";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/lib/utils";

function TagFilter({ tags, selectedTag, onTagSelect }) {
	logger.info("Tags:", tags);
	return (
		<div className="mb-8">
			<div className="flex items-center flex-wrap gap-2">
				<Badge
					className={`cursor-pointer ${!selectedTag ? "bg-primary" : ""}`}
					onClick={() => onTagSelect(null)}
				>
					All
				</Badge>
				{tags.map((tag) => (
					<Badge
						key={tag.id}
						className={`cursor-pointer ${selectedTag === tag.id ? "bg-primary" : ""}`}
						variant="secondary"
						onClick={() => onTagSelect(tag.id)}
					>
						{tag.name}
					</Badge>
				))}
			</div>
		</div>
	);
}

function BlogContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { subdomain } = useParams();
	const portfolioContext = usePortfolio();
	const [posts, setPosts] = useState([]);
	const [allPosts, setAllPosts] = useState([]);
	const [tags, setTags] = useState([]);
	const [portfolio, setPortfolio] = useState(portfolioContext?.portfolio);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const selectedTag = searchParams.get("tag");

	const handleTagSelect = (tagId) => {
		if (tagId) {
			router.push(`/blog?tag=${tagId}`);
		} else {
			router.push("/blog");
		}
	};

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

				// Only fetch posts if we have portfolio data and blog is enabled
				if (portfolio?.blogEnabled) {
					const result = await getBlogPosts(portfolio.id);
					if (result.success) {
						setAllPosts(result.data);
						// Extract unique tags from all posts
						const uniqueTags = Array.from(
							new Set(result.data.flatMap((post) => post.tags))
						);
						setTags(uniqueTags);
					} else {
						setError("Failed to fetch posts");
						return NotFound();
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
	}, [subdomain, portfolio]);

	// Filter posts when tag changes
	useEffect(() => {
		if (selectedTag) {
			setPosts(
				allPosts.filter((post) =>
					post.tags?.some((tag) => tag.id === selectedTag)
				)
			);
		} else {
			setPosts(allPosts);
		}
	}, [selectedTag, allPosts]);

	if (isLoading) {
		return <BlogListSkeleton />;
	}

	if (error || !posts.length) {
		return NotFound();
	}

	return (
		<div className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 dark:text-white sm:text-4xl">
					From the blog
				</h2>

				<TagFilter
					tags={tags}
					selectedTag={selectedTag}
					onTagSelect={handleTagSelect}
				/>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<BlogListSkeleton />}>
			<BlogContent />
		</Suspense>
	);
}

function PostCard({ post }) {
	return (
		<Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
			<Link href={`/blog/post/${post.slug}`}>
				<div className="relative h-48 w-full">
					<Image
						src={post.featuredImage}
						alt={post.title}
						layout="fill"
						objectFit="cover"
					/>
				</div>
				<CardContent className="pt-4">
					<h3 className="mb-2 font-cal text-lg leading-6 text-gray-900 group-hover:text-gray-600 dark:text-gray-100 dark:group-hover:text-gray-300">
						{post.title}
					</h3>
					<p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
						{post.excerpt}
					</p>
					<div className="flex items-center gap-x-4">
						{/* <Image
							src={post.author.imageUrl}
							alt={post.title}
							className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800"
							width={32}
							height={32}
						/> */}
						<div className="text-sm">
							{/* <p className="font-semibold text-gray-900 dark:text-gray-100">
								{post.author.name}
							</p> */}
							<time
								dateTime={post.publishedAt}
								className="text-gray-500"
							>
								{post.publishedAt}
							</time>
						</div>
					</div>
					<div className="mt-auto flex flex-col px-5">
						{post.tags && post.tags.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{tags?.map((tag) => (
									<Badge
										className="px-1 py-0 text-[10px]"
										variant="secondary"
										key={tag.id}
									>
										{tag.name}
									</Badge>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}
