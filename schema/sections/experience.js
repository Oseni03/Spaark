import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";
import { defaultUrl, urlSchema } from "../shared/url";

// Schema
export const experienceSchema = itemSchema.extend({
	company: z.string().min(1),
	position: z.string(),
	location: z.string().optional(),
	date: z.string(),
	summary: z.string(),
	url: urlSchema,
});

// Defaults
export const defaultExperience = {
	...defaultItem,
	company: "",
	position: "",
	location: "",
	date: "",
	summary: "",
	url: defaultUrl,
};
