"use client";
import { ZodForm } from "@/components/zod-form";
import { saveContact } from "@/services/contact";
import { toast } from "sonner";
import { object, string } from "zod";

const ContactFormSchema = object({
	full_name: string({ required_error: "First name is required" }),
	email: string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	message: string({ required_error: "Message is required" }),
});

export const ContactForm = () => {
	const handleContact = async ({ email, full_name, message }) => {
		if (!email || !full_name || !message) {
			throw new Error("All fields are required.");
		}

		const response = await saveContact({ email, full_name, message });

		if (response.success) {
			toast.success("Will get back to you soon.");
		} else {
			console.log(response);
			toast.error("Error sending message. Try again later");
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
			onSubmit={handleContact}
		/>
	);
};
