import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";
import { defaultUrl, urlSchema } from "../shared/url";

// Schema
export const profileSchema = itemSchema.extend({
	network: z.string().min(1),
	username: z.string().min(1),
	icon: z
		.string()
		.describe(
			'Slug for the icon from https://simpleicons.org. For example, "github", "linkedin", etc.'
		),
	url: urlSchema,
});

// Defaults
export const defaultProfile = {
	...defaultItem,
	network: "",
	username: "",
	icon: "",
	url: defaultUrl,
};
