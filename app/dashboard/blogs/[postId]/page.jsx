"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	PencilSimple,
	CloudArrowUp,
	CloudX,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { BlogPostSkeleton } from "@/components/blog/blog-post-skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { BlogPost } from "@/components/blog/blog-post";
import { getPortfolioById } from "@/services/portfolio";

export default function Page() {
	const router = useRouter();
	const [isPublishing, setIsPublishing] = useState(false);
	const { postId } = useParams();
	const [blog, setBlog] = useState(null);
	const [portfolio, setPortfolio] = useState(null);
	const [blogLoading, setBlogLoading] = useState(true);
	const [portfolioLoading, setPortfolioLoading] = useState(true);

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
			} catch (error) {
				setBlog(null);
				toast.error("Blog post not found!");
			} finally {
				setBlogLoading(false);
			}
		};

		fetchPost();
	}, [postId]);

	useEffect(() => {
		const fetchPortfolio = async () => {
			if (!blog) return;
			try {
				setPortfolioLoading(true);
				const item = await getPortfolioById(blog.portfolioId);
				if (item.error) {
					throw new Error(item.error);
				}
				setPortfolio(item.data);
			} catch (error) {
				setPortfolio(null);
				toast.error("Portfolio not found!");
			} finally {
				setPortfolioLoading(false);
			}
		};

		fetchPortfolio();
	}, [blog]);

	const handleBack = () => {
		router.push("/dashboard/blogs");
	};

	const handleEdit = () => {
		router.push(`/dashboard/blogs/${postId}/edit`);
	};

	const handlePublish = async () => {
		try {
			setIsPublishing(true);
			const response = await fetch(`/api/blogs/${postId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					portfolioId: blog.portfolioId,
					status: blog.status === "draft" ? "published" : "draft",
					publishedAt: blog.status === "draft" ? new Date() : null,
				}),
			});
			const resp = await response.json();
			if (!response.ok || resp.error) {
				throw new Error(resp.error || "Failed to update blog post");
			}

			toast.success(
				`Blog post ${blog.status === "draft" ? "published" : "unpublished"} successfully`
			);
		} catch (error) {
			toast.error(
				error.message ||
					`Failed to ${
						blog.status === "draft" ? "publish" : "unpublish"
					} the blog post`
			);
		} finally {
			setIsPublishing(false);
		}
	};

	if (blogLoading || portfolioLoading) {
		return <BlogPostSkeleton />;
	}

	if (!blog || !portfolio) {
		return notFound();
	}

	const contentHtml =
		typeof blog.content === "string"
			? blog.content
			: JSON.stringify(blog.content);

	return (
		<div className="relative">
			<div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-background/80 backdrop-blur-sm px-6 py-4 border-b">
				<Button variant="ghost" size="sm" onClick={handleBack}>
					<ArrowLeft size={20} className="mr-2" />
					Back
				</Button>

				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={handleEdit}>
						<PencilSimple size={20} className="mr-2" />
						Edit
					</Button>
					<Button
						variant={
							blog.status === "draft" ? "default" : "secondary"
						}
						size="sm"
						onClick={handlePublish}
						disabled={isPublishing}
					>
						{blog.status === "draft" ? (
							<CloudArrowUp size={20} className="mr-2" />
						) : (
							<CloudX size={20} className="mr-2" />
						)}
						{isPublishing && <Spinner />}
						{blog.status === "draft" ? "Publish" : "Unpublish"}
					</Button>
				</div>
			</div>

			<BlogPost
				title={blog.title}
				date={blog.publishedAt || blog.updatedAt}
				author={{
					name: portfolio?.basics?.name || "Anonymous",
					image: portfolio?.basics?.picture,
				}}
				featuredImage={blog.featuredImage}
				excerpt={blog.excerpt}
				content={contentHtml}
			/>
		</div>
	);
}
