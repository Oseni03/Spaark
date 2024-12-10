import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";
import { linkSchema } from "../shared/links";

// Schema
export const projectSchema = itemSchema.extend({
	name: z.string().min(1, "Project name cannot be empty"),
	description: z.string(),
	date: z.string(),
	technologies: z.array(z.string()).default([]),
	url: z.literal("").or(z.string().url("Invalid URL")).nullable(), // Allow empty string, valid URL, or null
	image: z.literal("").or(z.string().url("Invalid URL")).nullable(), // Allow empty string, valid URL, or null
	video: z.literal("").or(z.string().url("Invalid URL")).nullable(), // Allow empty string, valid URL, or null
	links: z.array(linkSchema).default([]),
});

// Defaults
export const defaultProject = {
	...defaultItem,
	name: "",
	description: "",
	date: "",
	technologies: [],
	url: "",
	image: "",
	video: "",
	links: [],
};
