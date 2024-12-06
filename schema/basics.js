import { z } from "zod";

export const basicsSchema = z.object({
	name: z.string().min(2, "Name is required"),
	headline: z.string().min(2, "Headline is required"),
	email: z.literal("").or(z.string().email("Invalid email address")),
	phone: z.string().min(7, "Phone number is required"),
	location: z.string().min(2, "Location is required"),
	url: z
		.string()
		.url("Invalid personal or professional website URL")
		.optional(),
	picture: z.string().url("Invalid image URL").optional(),
	summary: z.string().default(""),
	about: z.string().default(""),
});

// Defaults
export const defaultBasics = {
	name: "",
	headline: "",
	email: "",
	phone: "",
	location: "",
	url: "",
	picture: "",
	summary: "",
	about: "",
};
