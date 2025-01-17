import { idSchema } from "./shared/id";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

export const portfolioSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(255),
	slug: z.string().min(1).max(255),
	isPublic: z.boolean().default(true),
	isPrimary: z.boolean().default(false),
});

export const defaultPortfolio = {
	id: createId(),
	name: "",
	slug: "",
	isPublic: false,
	isPrimary: false,
};
