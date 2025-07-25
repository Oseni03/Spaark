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
	const portfolios = useSelector((state) => state.portfolios.items);
	const [blog, setBlog] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setBlogLoading(true);
				const response = await fetch(`/api/blogs/${postId}`);
				if (!response.ok) {
					throw new Error("Failed to fetch blog post");
				}
				const post = await response.json();
				setBlog(post);
				logger.info("Got blog post from API");
			} catch (error) {
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

	if (blogLoading) {
		return <BlogPostSkeleton />;
	}

	if (!blog && !blogLoading) {
		return notFound();
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
