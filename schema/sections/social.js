import { z } from "zod";
import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const socialSchema = itemSchema.extend({
	network: z.string().min(1),
	username: z.string().min(1),
	url: z.string().url("Invalid profile URL"),
});

// Defaults
export const defaultSocial = {
	...defaultItem,
	network: "",
	username: "",
	url: "",
};
