import { z } from "zod";

import { certificationSchema } from "./certification";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { profileSchema } from "./profile";
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

// Schema
export const portfolioSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(255),
	slug: z.string().min(1).max(255),
	isPublic: z.boolean().default(true),
	isPrimary: z.boolean().default(false),
	basics: sectionSchema.extend(basicsSchema),
	certifications: sectionSchema.extend({
		id: z.literal("certification"),
		items: z.array(certificationSchema),
	}),
	educations: sectionSchema.extend({
		id: z.literal("education"),
		items: z.array(educationSchema),
	}),
	experiences: sectionSchema.extend({
		id: z.literal("experience"),
		items: z.array(experienceSchema),
	}),
	hackathons: sectionSchema.extend({
		id: z.literal("hackathon"),
		items: z.array(hackathonSchema),
	}),
	profiles: sectionSchema.extend({
		id: z.literal("profile"),
		items: z.array(profileSchema),
	}),
	projects: sectionSchema.extend({
		id: z.literal("project"),
		items: z.array(projectSchema),
	}),
	skills: sectionSchema.extend({
		id: z.literal("skill"),
		items: z.array(skillSchema),
	}),
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
	isPublic: false,
	isPrimary: false,
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
	profiles: {
		...defaultSection,
		id: "profiles",
		name: "Profiles",
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
export * from "./profile";
export * from "./project";
export * from "./skill";
