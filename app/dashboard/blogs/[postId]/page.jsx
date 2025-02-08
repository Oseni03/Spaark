"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateBlogInDatabase } from "@/redux/thunks/blog";
import {
	ArrowLeft,
	PencilSimple,
	CloudArrowUp,
	CloudX,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import dayjs from "dayjs";
import { BlogPostSkeleton } from "@/components/blog/blog-post-skeleton";
import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { BlogPost } from "@/components/blog/blog-post";

export default function Page() {
	const dispatch = useDispatch();
	const router = useRouter();
	const [isPublishing, setIsPublishing] = useState(false);
	const { postId } = useParams();
	const blog = useSelector((state) =>
		state.blogs.items.find((blog) => blog.id === postId)
	);
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((p) => p.id === blog?.portfolioId)
	);

	const handleBack = () => {
		router.push("/dashboard/blogs");
	};

	const handleEdit = () => {
		router.push(`/dashboard/blogs/${postId}/edit`);
	};

	const handlePublish = async () => {
		try {
			setIsPublishing(true);
			await dispatch(
				updateBlogInDatabase({
					blogId: postId,
					portfolioId: blog.portfolioId,
					data: {
						status: blog.status === "draft" ? "published" : "draft",
						publishedAt:
							blog.status === "draft" ? new Date() : null,
					},
				})
			).unwrap();

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

	if (!blog || !portfolio) {
		return <BlogPostSkeleton />;
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
				date={dayjs(blog.publishedAt || blog.updatedAt).format(
					"MMMM D, YYYY"
				)}
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
