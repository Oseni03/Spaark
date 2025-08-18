"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn, logger } from "@/lib/utils";
import { saveContact } from "@/services/contact";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
	email: z.string().email("Invalid email"),
	full_name: z.string().min(3, "Name must be at least 3 characters long"),
	subject: z.string(),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters long")
		.max(1000, "Message must not exceed 1000 characters"),
});

export const ContactForm = ({ className, ...props }) => {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			full_name: "",
			subject: "",
			message: "",
		},
	});

	async function onSubmit(values) {
		try {
			setIsLoading(true);

			const response = await saveContact(values);

			if (response.success) {
				toast.success("Message sent successfully!");
			} else {
				throw new Error(response.message || "Failed to send message");
			}
		} catch (error) {
			logger.error("Contact form submission failed", {
				error,
			});
			toast.error(
				error instanceof Error
					? error.message
					: "Error sending message. Please try again later."
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn("space-y-6", className)} {...props}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid space-y-6"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="full_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="subject"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subject</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Your Message</FormLabel>
								<FormControl>
									<Textarea {...field} rows={4} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full"
					>
						{isLoading && <Loader2 />}
						{isLoading ? "Sending..." : "Send Message"}
					</Button>
				</form>
			</Form>
		</div>
	);
};
