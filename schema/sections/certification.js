import { z } from "zod";

import { defaultItem, itemSchema } from "../shared/items";
import { defaultUrl, urlSchema } from "../shared/url";

// Schema
export const certificationSchema = itemSchema.extend({
	name: z.string().min(1),
	issuer: z.string(),
	date: z.string(),
	summary: z.string(),
	url: urlSchema,
});

// Defaults
export const defaultCertification = {
	...defaultItem,
	name: "",
	issuer: "",
	date: "",
	summary: "",
	url: defaultUrl,
};
