"use client";

import { useRouter, useParams, notFound } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { BlogForm } from "../../components/blog-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import { logger } from "@/lib/utils";
import { BlogPostSkeleton } from "@/components/blog/blog-post-skeleton";

export default function Page() {
	const router = useRouter();
	const { postId } = useParams();
	const [blogLoading, setBlogLoading] = useState(false);
	const [blog, setBlog] = useState(null);
	const [hasError, setHasError] = useState(false);
	const portfolios = useSelector((state) => state.portfolios.items);

	useEffect(() => {
		// Don't fetch if no postId
		if (!postId) {
			setHasError(true);
			return;
		}
		const fetchPost = async () => {
			try {
				setBlogLoading(true);
				setHasError(false);

				logger.info("Fetching blog post with ID: ", postId);

				const response = await fetch(`/api/blogs/${postId}`);

				if (response.status === 404) {
					setHasError(true);
					return;
				}

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const post = await response.json();
				logger.info("Fetched blog post: ", post);
				setBlog(post);
				logger.info("Got blog post from API");
			} catch (error) {
				logger.error("Error fetching blog post:", error);
				setHasError(true);
				toast.error("Blog post not found!");
			} finally {
				setBlogLoading(false);
			}
		};

		fetchPost();
	}, [postId]);

	const onSubmit = async (data) => {
		try {
			const response = await fetch(`/api/blogs/${postId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					portfolioId: blog.portfolioId,
				}),
			});
			const resp = await response.json();
			if (!response.ok || resp.error) {
				throw new Error(resp.error || "Failed to update blog post");
			}

			toast.success("Blog post updated successfully");
			router.push("/dashboard/blogs");
		} catch (error) {
			toast.error(error.message || "Failed to update blog post");
		}
	};

	// Show loading state
	if (blogLoading || !blog) {
		return <BlogPostSkeleton />;
	}

	// Show 404 if there was an error or no blog found
	if (hasError || (!blog && !blogLoading)) {
		notFound();
	}

	return (
		<div className="container max-w-4xl py-10">
			<BlogForm
				onSubmit={onSubmit}
				defaultValues={blog}
				portfolios={portfolios}
			/>
		</div>
	);
}
