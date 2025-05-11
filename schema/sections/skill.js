import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const skillSchema = itemSchema.extend({
	name: z.string().min(1, "Skill name is required").max(50),
	description: z.literal("").or(z.string()),
	level: z.literal("").or(z.string()).nullable(),
});

// Defaults
export const defaultSkill = {
	...defaultItem,
	name: "",
	level: "",
	description: "",
};
