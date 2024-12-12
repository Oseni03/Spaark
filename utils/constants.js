import { object, string } from "zod";

export const TITLE_TAILWIND_CLASS =
	"text-2xl sm:text-2xl md:text-3xl lg:text-4xl";

export const PORTFOLIO_TAILWIND_CLASS = "max-w-2xl mx-auto py-12 sm:py-24 px-6";

export const ContactFormSchema = object({
	full_name: string({ required_error: "First name is required" }),
	email: string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	message: string({ required_error: "Message is required" }),
});
