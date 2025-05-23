import { createId } from "@paralleldrive/cuid2";
import { idSchema } from "../shared/id";
import { z } from "zod";

export const basicsSchema = z.object({
	id: idSchema,
	portfolioId: z.string(),
	name: z.literal("").or(z.string().min(2, "Must be more than 2 char")),
	headline: z.literal("").or(z.string().min(2, "Must be more than 2 char")),
	email: z.literal("").or(z.string().email("Invalid email address")),
	phone: z.literal("").or(z.string().min(7, "Invalid phone number")),
	location: z.literal("").or(z.string().min(2, "Must be more than 2 char")),
	years: z.number().nullable(),
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
	years: "",
	url: "",
	picture: "",
	summary: "",
	about: "",
};
