"use client";
import { ZodForm } from "@/components/zod-form";
import { ContactFormSchema } from "@/schema/contact";
import { saveContact } from "@/services/contact";

export const ContactForm = () => {
	const handleContact = async ({ email, full_name, message }) => {
		if (!email || !full_name || !message) {
			throw new Error("All fields are required.");
		}
		console.log("Saving contact message: ", message);

		const response = await saveContact({ email, full_name, message });

		if (response.success) {
			toast.success(response.message);
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
