"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BlogForm } from "../../components/blog-form";
import { updateBlogInDatabase } from "@/redux/thunks/blog";
import { toast } from "sonner";

export default function EditBlogPost({ params }) {
	const dispatch = useDispatch();
	const router = useRouter();
	const { loading } = useSelector((state) => state.blogs);
	const portfolios = useSelector((state) => state.portfolios.items);
	const blog = useSelector((state) =>
		state.blogs.items.find((blog) => blog.id === params.postId)
	);

	const onSubmit = async (data) => {
		try {
			await dispatch(
				updateBlogInDatabase({ id: params.postId, ...data })
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
				portfolios={portfolios}
				loading={loading}
				defaultValues={blog}
			/>
		</div>
	);
}
