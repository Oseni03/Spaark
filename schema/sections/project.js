import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const projectSchema = itemSchema.extend({
	name: z.string().min(1),
	description: z.string(),
	date: z.string(),
	keywords: z.array(z.string()).default([]),
	url: z.literal("").or(z.string().url()),
	source: z.literal("").or(z.string().url()),
});

// Defaults
export const defaultProject = {
	...defaultItem,
	name: "",
	description: "",
	date: "",
	keywords: [],
	url: "",
	source: "",
};
