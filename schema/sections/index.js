import { z } from "zod";

import { certificationSchema } from "./certification";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { socialSchema } from "./social";
import { projectSchema } from "./project";
import { skillSchema } from "./skill";
import { hackathonSchema } from "./hackathon";
import { createId } from "@paralleldrive/cuid2";
import { basicsSchema, defaultBasics } from "./basics";
import { idSchema } from "../shared/id";

// Schema
export const sectionSchema = z.object({
	name: z.string(),
	visible: z.boolean().default(true),
});

export const portfolioSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(255),
	slug: z.string().min(1).max(255),
	isLive: z.boolean().default(false),
	blogEnabled: z.boolean().default(false),
	template: z.string().default("default"),
});

// Schema
export const mainSchema = portfolioSchema.extend({
	customDomain: z.string().optional().nullable(),
	basics: basicsSchema.omit({ id: true, portfolioId: true }).optional(),
	certifications: z
		.object({
			id: z.literal("certification"),
			name: z.string(),
			visible: z.boolean(),
			items: z
				.array(certificationSchema.omit({ portfolioId: true }))
				.default([]),
		})
		.optional(),
	educations: z
		.object({
			id: z.literal("education"),
			name: z.string(),
			visible: z.boolean(),
			items: z
				.array(educationSchema.omit({ portfolioId: true }))
				.default([]),
		})
		.optional(),
	experiences: z
		.object({
			id: z.literal("experience"),
			name: z.string(),
			visible: z.boolean(),
			items: z
				.array(experienceSchema.omit({ portfolioId: true }))
				.default([]),
		})
		.optional(),
	hackathons: z
		.object({
			id: z.literal("hackathon"),
			name: z.string(),
			visible: z.boolean(),
			items: z
				.array(hackathonSchema.omit({ portfolioId: true }))
				.default([]),
		})
		.optional(),
	socials: z
		.object({
			id: z.literal("social"),
			name: z.string(),
			visible: z.boolean(),
			items: z
				.array(socialSchema.omit({ portfolioId: true }))
				.default([]),
		})
		.optional(),
	projects: z
		.object({
			id: z.literal("project"),
			name: z.string(),
			visible: z.boolean(),
			items: z
				.array(projectSchema.omit({ portfolioId: true }))
				.default([]),
		})
		.optional(),
	skills: z
		.object({
			id: z.literal("skill"),
			name: z.string(),
			visible: z.boolean(),
			items: z.array(skillSchema.omit({ portfolioId: true })).default([]),
		})
		.optional(),
});

// Defaults
export const defaultSection = {
	name: "",
	visible: true,
	status: "idle", // Added to track async operation status
	error: null,
};

export const defaultPortfolio = {
	id: createId(),
	name: "",
	slug: "",
	isLive: false,
	blogEnabled: false,
	template: "default",
};

export const defaultMain = {
	...defaultPortfolio,
	customDomain: "",
	basics: {
		...defaultSection,
		...defaultBasics,
		id: "basics",
	},
	hackathons: {
		...defaultSection,
		id: "hackathon",
		name: "Hackathons",
		items: [],
	},
	certifications: {
		...defaultSection,
		id: "certification",
		name: "Certifications",
		items: [],
	},
	educations: {
		...defaultSection,
		id: "education",
		name: "Education",
		items: [],
	},
	experiences: {
		...defaultSection,
		id: "experience",
		name: "Experiences",
		items: [],
	},
	socials: {
		...defaultSection,
		id: "social",
		name: "Socials",
		items: [],
	},
	projects: {
		...defaultSection,
		id: "projects",
		name: "Projects",
		items: [],
	},
	skills: { ...defaultSection, id: "skills", name: "Skills", items: [] },
};

export * from "./certification";
export * from "./education";
export * from "./experience";
export * from "./hackathon";
export * from "./language";
export * from "./social";
export * from "./project";
export * from "./skill";
