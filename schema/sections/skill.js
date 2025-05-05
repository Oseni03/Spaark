import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const skillSchema = itemSchema.extend({
	name: z.string(),
	description: z.literal("").or(z.string()),
	level: z.literal("").or(z.string()),
});

// Defaults
export const defaultSkill = {
	...defaultItem,
	name: "",
	level: "",
};
