import { z } from "zod";

// Schema
export const urlSchema = z.object({
	label: z.string(),
	href: z.literal("").or(z.string().url()),
});

// Defaults
export const defaultUrl = {
	label: "",
	href: "",
};
