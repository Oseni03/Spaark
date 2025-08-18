"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { logger } from "@/lib/utils";
import { useParams } from "next/navigation";

const formSchema = z.object({
	email: z.string().email("Invalid email"),
	full_name: z.string().min(3, "Name must be at least 3 characters long"),
	subject: z.string(),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters long")
		.max(1000, "Message must not exceed 1000 characters"),
});

export const useUserContactForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { subdomain } = useParams();

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

			if (!subdomain) {
				throw new Error("Can't send contact email from builder page");
			}
			const response = await fetch("/api/send-user-contact-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subdomain,
					subject: values.subject,
					props: {
						subject: values.subject,
						name: values.full_name,
						email: values.email,
						message: values.message,
					},
				}),
			});

			const { success, error } = await response.json();

			if (success) {
				toast.success("Message sent successfully!");
			} else {
				throw new Error(error || "Failed to send message");
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

	return {
		form,
		isSubmitting: isLoading,
		onSubmit,
	};
};
