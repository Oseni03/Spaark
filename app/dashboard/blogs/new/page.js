"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BlogForm } from "../components/blog-form";
import { createBlogInDatabase } from "@/redux/thunks/blog";
import { toast } from "sonner";
import { defaultBlog } from "@/schema/sections/blog";

export default function NewBlogPost() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { loading } = useSelector((state) => state.blogs);
	const portfolios = useSelector((state) => state.portfolios.items);

	const onSubmit = async (data) => {
		try {
			await dispatch(
				createBlogInDatabase(...defaultBlog, ...data)
			).unwrap();
			toast.success("Blog post created successfully");
			router.push("/dashboard/blogs");
		} catch (error) {
			toast.error(error.message || "Failed to create blog post");
		}
	};

	return (
		<div className="container max-w-4xl py-10">
			<BlogForm
				onSubmit={onSubmit}
				portfolios={portfolios}
				loading={loading}
			/>
		</div>
	);
}
