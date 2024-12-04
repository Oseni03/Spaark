import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const skillSchema = itemSchema.extend({
	name: z.string(),
	keywords: z.array(z.string()).default([]),
});

// Defaults
export const defaultSkill = {
	...defaultItem,
	name: "",
	keywords: [],
};
