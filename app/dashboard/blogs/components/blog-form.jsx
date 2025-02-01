"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { FeaturedImage } from "../new/components/featured-image";
import { z } from "zod";

// Form Schema
const blogFormSchema = blogMetadataSchema.extend({
	portfolioId: z.string({
		required_error: "Please select a portfolio",
	}),
	content: z.any().nullable(),
});

export function BlogForm({
	onSubmit,
	portfolios,
	loading,
	defaultValues = {
		portfolioId: "",
		title: "",
		excerpt: "",
		content: null,
		featuredImage: undefined,
	},
}) {
	const form = useForm({
		resolver: zodResolver(blogFormSchema),
		defaultValues,
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="portfolioId"
					render={({ field }) => (
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
											{portfolio.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter blog title"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="excerpt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Excerpt</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter blog excerpt"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="featuredImage"
					render={({ field }) => (
						<FormItem className="flex flex-col space-y-5">
							<FormLabel>Featured Image</FormLabel>
							<FormControl>
								<FeaturedImage
									image={field.value}
									setImage={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
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
							<FormMessage />
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
