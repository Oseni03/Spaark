"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BlogForm } from "../components/blog-form";
import { createBlogInDatabase } from "@/redux/thunks/blog";
import { toast } from "sonner";
import { defaultBlogMetadata } from "@/schema/sections/blog";
import { logger } from "@/lib/utils";

export default function NewBlogPost() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { loading } = useSelector((state) => state.blogs);
	const portfolios = useSelector((state) => state.portfolios.items);

	logger.info("Initializing NewBlogPost component", {
		portfoliosCount: portfolios?.length,
	});

	logger.info("Available portfolios for blog post: ", { portfolios });

	const onSubmit = async (data) => {
		const startTime = performance.now();
		logger.info("Starting blog creation", { blogTitle: data.title });

		try {
			// Destructure portfolioId and create proper payload structure
			const { portfolioId, ...blogData } = data;

			logger.info("Creating blog with data:", { portfolioId, blogData });

			await dispatch(
				createBlogInDatabase({
					portfolioId,
					data: {
						...defaultBlogMetadata,
						...blogData,
					},
				})
			).unwrap();

			const endTime = performance.now();
			logger.info("Blog post created successfully", {
				duration: `${(endTime - startTime).toFixed(2)}ms`,
				blogTitle: data.title,
				portfolioId: data.portfolioId,
			});

			toast.success("Blog post created successfully");
			router.push("/dashboard/blogs");
		} catch (error) {
			logger.error("Failed to create blog post", {
				error: error.message,
				stack: error.stack,
				blogData: data,
			});
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
