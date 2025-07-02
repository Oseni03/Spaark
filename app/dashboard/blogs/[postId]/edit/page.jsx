"use client";

import { useRouter, useParams, notFound } from "next/navigation";
import { toast } from "sonner";
import { BlogForm } from "../../components/blog-form";
import { useState } from "react";
import { updateBlog, getBlog } from "@/services/blog";
import { useAuth } from "@/context/auth-context";
import { useSelector } from "react-redux";

export default function Page() {
	const router = useRouter();
	const { user } = useAuth();
	const { postId } = useParams();
	const [blogLoading, setBlogLoading] = useState(false);
	const portfolios = useSelector((state) => state.portfolios.items);
	const [blog, setBlog] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setBlogLoading(true);
				const post = await getBlog(postId);
				if (post.error) {
					throw new Error(post.error);
				}
				setBlog(post.data);
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
			const resp = await updateBlog({
				blogId: postId,
				portfolioId: blog.portfolioId,
				data,
			});
			if (resp.error) {
				throw new Error(resp.error);
			}

			toast.success("Blog post updated successfully");
			router.push("/dashboard/blogs");
		} catch (error) {
			toast.error(error.message || "Failed to update blog post");
		}
	};

	if (blogLoading) {
		return <div>Loading...</div>;
	}

	if (!blog) {
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
