import { z } from "zod";
import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const teamSchema = itemSchema.extend({
	name: z.string().min(1),
	role: z.string().min(1),
	bio: z.string().optional(),
	avatar: z.literal("").or(z.string().url()).nullable(),
	links: z
		.array(
			z.object({
				label: z.string(),
				url: z.string().url(),
				icon: z.string().optional(),
			})
		)
		.optional(),
});

// Defaults
export const defaultTeam = {
	...defaultItem,
	name: "",
	role: "",
	bio: "",
	avatar: "",
	links: [],
};
