import { z } from "zod";

import { idSchema } from "./id";
import { createId } from "@paralleldrive/cuid2";

// Schema
export const linkSchema = z.object({
	id: idSchema,
	label: z.string(),
	url: z.string().url("Invalid URL"),
	icon: z.literal("").or(z.string()).nullable(), // Allow empty string or null
});

// Defaults
export const defaultLink = {
	id: createId(),
	label: "",
	url: "",
	icon: "",
};
