"use client";

import { useRouter, useParams, notFound } from "next/navigation";
import { toast } from "sonner";
import { BlogForm } from "../../components/blog-form";
import { useState } from "react";
import { updateBlog, getBlog } from "@/services/blog";
import { getPortfolios } from "@/services/portfolio";
import { useAuth } from "@/context/auth-context";

export default function Page() {
	const router = useRouter();
	const { user } = useAuth();
	const { postId } = useParams();
	const [loading, setLoading] = useState(false);
	const [blogLoading, setBlogLoading] = useState(false);
	const [portfolios, setPortfolios] = useState([]);
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

	useEffect(() => {
		const fetchPortfolio = async () => {
			try {
				// setLoading(true);
				const item = await getPortfolios(user.id);
				if (item.error) {
					throw new Error(item.error);
				}
				setPortfolios(item.data);
			} catch (error) {
				toast.error("Portfolio not found!");
			} finally {
				// setLoading(false);
			}
		};

		fetchPortfolio();
	}, [user]);

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			await updateBlog({
				blogId: postId,
				portfolioId: blog.portfolioId,
				data,
			});

			toast.success("Blog post updated successfully");
			router.push("/dashboard/blogs");
		} catch (error) {
			toast.error(error.message || "Failed to update blog post");
		} finally {
			setLoading(false);
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
				loading={loading}
				defaultValues={blog}
				portfolios={portfolios}
			/>
		</div>
	);
}
