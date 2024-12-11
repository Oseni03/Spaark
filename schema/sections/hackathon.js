import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";
import { linkSchema } from "../shared/links";

// Schema
export const hackathonSchema = itemSchema.extend({
	name: z.string().min(1),
	location: z.string(),
	description: z.string(),
	date: z.string(),
	logo: z.literal("").or(z.string().url("Invalid image URL")).nullable(),
	links: z.array(linkSchema).default([]),
});

// Defaults
export const defaultHackathon = {
	...defaultItem,
	name: "",
	location: "",
	description: "",
	date: "",
	logo: "",
	links: [],
};
