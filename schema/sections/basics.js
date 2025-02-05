import { createId } from "@paralleldrive/cuid2";
import { idSchema } from "../shared/id";
import { z } from "zod";

export const basicsSchema = z.object({
	id: idSchema,
	portfolioId: z.string(),
	name: z.literal("").or(z.string().min(2, "Name is required")),
	headline: z.literal("").or(z.string().min(2, "Headline is required")),
	email: z.literal("").or(z.string().email("Invalid email address")),
	phone: z.literal("").or(z.string().min(7, "Phone number is required")),
	location: z.literal("").or(z.string().min(2, "Location is required")),
	url: z
		.literal("")
		.or(z.string().url("Invalid personal or professional website URL")),
	picture: z.literal("").or(z.string().url("Invalid image URL")),
	summary: z.string().default(""),
	about: z.string().default(""),
});

// Defaults
export const defaultBasics = {
	id: createId(),
	portfolioId: "",
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
