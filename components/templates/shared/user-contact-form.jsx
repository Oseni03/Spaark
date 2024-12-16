"use client";
import { ZodForm } from "@/components/zod-form";
import { ContactFormSchema } from "@/schema/contact";
import { toast } from "sonner";
import ContactNotification from "@/emails/templates/contact-notification";
import { useParams } from "next/navigation";

export const UserContactForm = () => {
	const { subdomain } = useParams();

	const onSubmit = async ({ name, email, message }) => {
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

			if (result.success) {
				toast.success("Message sent successfully!");
			} else {
				toast.error(result.error || "Failed to send message");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
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
				},
				{
					name: "email",
					type: "email",
					label: "Email",
					placeholder: "Enter your email address",
				},
				{
					name: "message",
					type: "textarea",
					label: "Message",
					placeholder: "Write to us",
				},
			]}
			submitLabel="Send"
			onSubmit={onSubmit}
		/>
	);
};
