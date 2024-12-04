import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const hackathonSchema = itemSchema.extend({
	name: z.string().min(1),
	location: z.string(),
	description: z.string(),
	date: z.string(),
});

// Defaults
export const defaultInterest = {
	...defaultItem,
	name: "",
	location: "",
	description: "",
	date: "",
};
