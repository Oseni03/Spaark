import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";
import { defaultUrl, urlSchema } from "../shared/url";

// Schema
export const projectSchema = itemSchema.extend({
	name: z.string().min(1),
	description: z.string(),
	date: z.string(),
	keywords: z.array(z.string()).default([]),
	url: urlSchema,
	source: urlSchema,
});

// Defaults
export const defaultProject = {
	...defaultItem,
	name: "",
	description: "",
	date: "",
	keywords: [],
	url: defaultUrl,
	source: defaultUrl,
};
