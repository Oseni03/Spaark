import { z } from "zod";

import { idSchema } from "./id";
import { createId } from "@paralleldrive/cuid2";

// Schema
export const linkSchema = z.object({
	id: idSchema,
	label: z.string(),
	url: z.string().url("Invalid URL"),
	icon: z.string().nullable(), // Changed to properly handle null values
});

// Defaults
export const defaultLink = {
	id: createId(),
	label: "",
	url: "",
	icon: null, // Changed from empty string to null
};
