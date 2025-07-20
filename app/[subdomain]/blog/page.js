"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { usePortfolio } from "@/context/PortfolioContext";
import { getBlogPosts } from "@/services/blog";
import { getPortfolioBySlug } from "@/services/portfolio";
import BlogListSkeleton from "@/components/blog/blog-list-skeleton";
import NotFound from "@/app/not-found";
import Container from "@/components/blog/container";
import PostList from "@/components/blog/postlist";
import Pagination from "@/components/blog/pagination";

const POSTS_PER_PAGE = 9;

function BlogContent() {
	const { subdomain } = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();
	const portfolioContext = usePortfolio();
	const [posts, setPosts] = useState([]);
	const [tags, setTags] = useState([]);
	const [portfolio, setPortfolio] = useState(portfolioContext?.portfolio);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Pagination
	const page = parseInt(searchParams.get("page") || "1", 10);
	const selectedTag = searchParams.get("tag") || null;

	useEffect(() => {
		async function initializeData() {
			try {
				if (!portfolio) {
					const portfolioResult = await getPortfolioBySlug(subdomain);
					if (!portfolioResult.success) {
						setError("Portfolio not found");
						return;
					}
					setPortfolio(portfolioResult.data);
				}
				if (portfolio?.blogEnabled) {
					const result = await getBlogPosts(portfolio.id);
					if (result.success) {
						setPosts(result.data);
						// Collect all unique tags from posts
						const tags = Array.from(
							new Map(
								result.data
									.flatMap((post) => post.categories || [])
									.map((cat) => [cat.slug.current, cat])
							).values()
						);
						setTags(tags);
					} else {
						setError("Failed to fetch posts");
						return NotFound();
					}
				} else {
					setError("Blog not enabled");
				}
			} catch (error) {
				setError("An error occurred");
			} finally {
				setIsLoading(false);
			}
		}
		initializeData();
	}, [subdomain, portfolio]);

	// Filter posts by tag
	const filteredPosts = selectedTag
		? posts.filter((post) =>
				(post.categories || []).some(
					(cat) => cat.slug.current === selectedTag
				)
			)
		: posts;

	// Pagination logic
	const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
	const paginatedPosts = filteredPosts.slice(
		(page - 1) * POSTS_PER_PAGE,
		page * POSTS_PER_PAGE
	);

	const handleTagSelect = (slug) => {
		const params = new URLSearchParams(searchParams.toString());
		if (slug) {
			params.set("tag", slug);
			params.set("page", "1");
		} else {
			params.delete("tag");
			params.set("page", "1");
		}
		router.push(`/blog?${params.toString()}`);
	};

	if (isLoading) {
		return <BlogListSkeleton />;
	}
	if (error || !filteredPosts.length) {
		return NotFound();
	}

	return (
		<Container>
			{/* Tag/Category Filter */}
			<div className="mb-8 flex flex-wrap gap-2">
				<button
					className={`px-3 py-1 rounded-full text-sm font-medium border ${!selectedTag ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"}`}
					onClick={() => handleTagSelect(null)}
				>
					All
				</button>
				{tags.map((cat) => (
					<button
						key={cat.slug.current}
						className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedTag === cat.slug.current ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"}`}
						onClick={() => handleTagSelect(cat.slug.current)}
					>
						{cat.title}
					</button>
				))}
			</div>
			{/* Posts Grid */}
			<div className="grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
				{paginatedPosts.map((post, index) => (
					<PostList
						key={index}
						post={post}
						aspect="square"
						pathPrefix="blog/post"
					/>
				))}
			</div>
			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination
					pageIndex={page}
					isFirstPage={page === 1}
					isLastPage={page === totalPages}
				/>
			)}
		</Container>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<BlogListSkeleton />}>
			<BlogContent />
		</Suspense>
	);
}
