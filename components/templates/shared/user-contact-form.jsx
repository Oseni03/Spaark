"use client";
import { ZodForm } from "@/components/zod-form";
import { ContactFormSchema } from "@/schema/contact";
import { toast } from "sonner";
import ContactNotification from "@/emails/templates/contact-notification";
import { useParams } from "next/navigation";
import { useState } from "react";
import { logger } from "@/lib/utils";

export const UserContactForm = () => {
	const { subdomain } = useParams();
	const [isLoading, setLoading] = useState(false);

	logger.info("User contact form subdomain: ", subdomain);

	const onSubmit = async ({ name, email, message }) => {
		logger.info("Submitting user contact message");
		setLoading(true);
		try {
			const templateMessage = (
				<ContactNotification
					name={name}
					email={email}
					message={message}
				/>
			);

			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: subdomain,
					subject: "New contact message",
					reactTemplate: templateMessage,
				}),
			});

			const result = await response.json();
			setLoading(false);

			if (result.success) {
				toast.success("Message sent successfully!");
			} else {
				toast.error(result.error || "Failed to send message");
			}
		} catch (error) {
			setLoading(false);
			toast.error("An unexpected error occurred");
			logger.error("User contact form error: ", error);
		}
	};

	return (
		<ZodForm
			schema={ContactFormSchema}
			defaultValues={{
				full_name: "",
				email: "",
				message: "",
			}}
			fields={[
				{
					name: "full_name",
					type: "text",
					label: "Full Name",
					placeholder: "Enter your full name",
					className: "text-black dark:text-white",
				},
				{
					name: "email",
					type: "email",
					label: "Email",
					placeholder: "Enter your email address",
					className: "text-black dark:text-white",
				},
				{
					name: "message",
					type: "textarea",
					label: "Message",
					placeholder: "Write to us",
					className: "text-black dark:text-white",
				},
			]}
			submitLabel="Send"
			onSubmit={onSubmit}
			isLoading={isLoading}
		/>
	);
};
