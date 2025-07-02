"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BlogForm } from "../components/blog-form";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
import { getPortfolioById, createBlogAction } from "@/services/portfolio";

export default function NewBlogPost() {
	const router = useRouter();
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

			if (!portfolioId) {
				throw new Error("Portfolio is required");
			}

			// Check if portfolio belongs to user and has blog enabled
			const portfolio = await getPortfolioById(portfolioId);

			if (portfolio.error) {
				throw new Error(portfolio.error || "Portfolio not found");
			}

			if (!portfolio.data.blogEnabled) {
				throw new Error("Blog is not enabled for this portfolio");
			}

			await createBlogAction({
				portfolioId,
				data: {
					...data,
					status: "draft",
				},
			});

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
			<BlogForm onSubmit={onSubmit} portfolios={portfolios} />
		</div>
	);
}
