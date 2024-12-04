import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const languageSchema = itemSchema.extend({
	name: z.string().min(1),
});

// Defaults
export const defaultLanguage = {
	...defaultItem,
	name: "",
};
