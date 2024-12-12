import { z } from "zod";

// Validation schema
export const ContactFormSchema = z.object({
	username: z
		.literal("")
		.or(z.string().min(1, "Username is required"))
		.nullable(),
	full_name: z.string().min(2, "Full name is required"),
	email: z.string().email("Invalid email address"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});
