import { z } from "zod";
import { idSchema } from "./shared/id";
import { userSchema } from "./user";
import { basicsSchema, defaultBasics } from "./basics";
import { sectionsSchema, defaultSections } from "./sections";

// Schema
export const portfolioDataSchema = z.object({
	basics: basicsSchema,
	sections: sectionsSchema,
});

// Defaults
export const defaultPortfolioData = {
	basics: defaultBasics,
	sections: defaultSections,
};

export const portfolioSchema = z.object({
	id: idSchema,
	title: z.string(),
	slug: z.string(),
	data: portfolioDataSchema.default(defaultPortfolioData),
	visibility: z.enum(["private", "public"]).default("private"),
	locked: z.boolean().default(false),
	userId: idSchema,
	user: userSchema.optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
