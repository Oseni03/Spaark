"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { BlogForm } from "../../components/blog-form";
import { updateBlogInDatabase } from "@/redux/thunks/blog";

export default function Page() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { postId } = useParams();
	const { loading } = useSelector((state) => state.blogs);
	const portfolios = useSelector((state) => state.portfolios.items);
	const blog = useSelector((state) =>
		state.blogs.items.find((blog) => blog.id === postId)
	);

	const onSubmit = async (data) => {
		try {
			await dispatch(
				updateBlogInDatabase({
					blogId: postId,
					portfolioId: blog.portfolioId,
					data,
				})
			).unwrap();

			toast.success("Blog post updated successfully");
			router.push("/dashboard/blogs");
		} catch (error) {
			toast.error(error.message || "Failed to update blog post");
		}
	};

	if (!blog) {
		return <div>Loading...</div>;
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
