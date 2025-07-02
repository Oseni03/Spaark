"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { slugify } from "@/utils/text";
import { blogMetadataSchema } from "@/schema/sections/blog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichInput } from "@/components/ui/rich-input";
import { FeaturedImage } from "./featured-image";
import { z } from "zod";
import { logger } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BadgeInput } from "@/components/ui/badge-input";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Form Schema
const blogFormSchema = blogMetadataSchema.extend({
	portfolioId: z.string({
		required_error: "Please select a portfolio",
	}),
	content: z.any().nullable(),
});

// Transform a tag string into a tag object
const createTagObject = (tagName) => ({
	name: tagName,
	slug: slugify(tagName),
});

export function BlogForm({
	onSubmit,
	portfolios,
	defaultValues = {
		portfolioId: "",
		title: "",
		excerpt: "",
		content: null,
		featuredImage: undefined,
		tags: [],
	},
}) {
	const [loading, setLoading] = useState(false);
	const form = useForm({
		resolver: zodResolver(blogFormSchema),
		defaultValues,
		mode: "onChange", // Enable real-time validation
	});

	const {
		formState: { errors },
	} = form;

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.error("Form Validation Errors:", errors);
		}
	}, [errors]);

	logger.info("BlogForm initialized", {
		portfoliosAvailable: portfolios.length,
		hasDefaultValues: !!Object.keys(defaultValues).length,
	});

	const validateSlugUniqueness = async (slug, blogId = null) => {
		try {
			const response = await fetch("/api/blogs/validate-slug", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug, excludeId: blogId }),
			});

			const data = await response.json();
			if (!data.isUnique) {
				throw new Error(
					"This slug is already in use. Please choose a different one."
				);
			}
		} catch (error) {
			throw new Error(
				error.message || "Failed to validate slug uniqueness"
			);
		}
	};

	const handleSubmit = async (data) => {
		setLoading(true);
		try {
			logger.info("Validating form data", { data });

			// Validate required fields
			if (!data.title || !data.portfolioId) {
				logger.error("Form validation failed", { data });
				throw new Error("Please fill in all required fields");
			}

			// Validate slug uniqueness
			await validateSlugUniqueness(data.slug, defaultValues.id);

			// Ensure content is not null
			const formData = {
				...data,
				content: data.content || "", // Provide default empty string if null
			};

			logger.info("Submitting form data", { formData });
			await onSubmit(formData);
		} catch (error) {
			logger.error("Form submission error", {
				error: error.message,
				formData: data,
			});
			toast.error(error?.message || "Invalid data");
			// Set form error for slug field if it's a slug uniqueness error
			if (error.message.includes("slug is already in use")) {
				form.setError("slug", {
					type: "manual",
					message: error.message,
				});
			}
			// Let the error propagate to be handled by the parent
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const generateSlug = () => {
		const title = form.getValues("title");
		form.setValue("slug", slugify(title));
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-8"
				noValidate // Let our custom validation handle it
			>
				<FormField
					control={form.control}
					name="portfolioId"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Select Portfolio</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a portfolio" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{portfolios.map((portfolio) => (
										<SelectItem
											key={portfolio.id}
											value={portfolio.id}
										>
											{portfolio.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="title"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter blog title"
									{...field}
								/>
							</FormControl>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<div className="flex gap-2">
								<FormControl>
									<Input
										placeholder="Enter post slug"
										{...field}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									onClick={generateSlug}
								>
									Generate
								</Button>
							</div>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="excerpt"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Excerpt</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter blog excerpt"
									{...field}
								/>
							</FormControl>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="tags"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Tags</FormLabel>
							<FormControl>
								<div className="space-y-2">
									<BadgeInput
										value={
											field.value?.map(
												(tag) => tag.name
											) || []
										}
										onChange={(newTags) => {
											const tagObjects =
												newTags.map(createTagObject);
											field.onChange(tagObjects);
										}}
										placeholder="Enter tags separated by commas"
									/>
									<div className="flex flex-wrap items-center gap-x-2 gap-y-3">
										<AnimatePresence>
											{field.value?.map((tag, index) => (
												<motion.div
													key={tag.slug}
													layout
													initial={{
														opacity: 0,
														y: -50,
													}}
													animate={{
														opacity: 1,
														y: 0,
														transition: {
															delay: index * 0.1,
														},
													}}
													exit={{
														opacity: 0,
														x: -50,
													}}
												>
													<Badge
														className="cursor-pointer"
														onClick={() => {
															field.onChange(
																field.value.filter(
																	(v) =>
																		v.slug !==
																		tag.slug
																)
															);
														}}
													>
														<span className="mr-1">
															{tag.name}
														</span>
														<X
															size={12}
															weight="bold"
														/>
													</Badge>
												</motion.div>
											))}
										</AnimatePresence>
									</div>
								</div>
							</FormControl>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="featuredImage"
					render={({ field, fieldState }) => (
						<FormItem className="flex flex-col space-y-5">
							<FormLabel>Featured Image</FormLabel>
							<FormControl>
								<FeaturedImage
									image={field.value}
									setImage={field.onChange}
								/>
							</FormControl>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<RichInput
									content={field.value}
									onChange={field.onChange}
									className="min-h-[500px]"
									editorClassName="min-h-[500px]"
								/>
							</FormControl>
							{fieldState.error && (
								<FormMessage>
									{fieldState.error?.message}
								</FormMessage>
							)}
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={loading}>
					{loading ? "Saving..." : "Save Blog Post"}
				</Button>
			</form>
		</Form>
	);
}
