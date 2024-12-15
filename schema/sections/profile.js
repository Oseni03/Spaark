import { z } from "zod";
import { defaultItem, itemSchema } from "../shared/items";

// Schema
export const profileSchema = itemSchema.extend({
	network: z.string().min(1),
	username: z.string().min(1),
	url: z.string().url("Invalid profile URL"),
});

// Defaults
export const defaultProfile = {
	...defaultItem,
	network: "",
	username: "",
	url: "",
};
