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
import { testimonialSchema } from "./testimonial";
import { teamSchema } from "./team"; // Add this line

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
	isLive: z.boolean().default(false),
	blogEnabled: z.boolean().default(false),
	isPrimary: z.boolean().default(false),
	template: z.string().default("default"),
	customDomain: z.string().optional(),
	// Add organization fields
	organizationId: z.string().optional(),
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
	testimonials: sectionSchema.extend({
		id: z.literal("testimonial"),
		items: z.array(testimonialSchema),
	}),
	teams: sectionSchema.extend({
		// Add this section
		id: z.literal("team"),
		items: z.array(teamSchema),
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
	isLive: false,
	blogEnabled: false,
	isPrimary: false,
	template: "default",
	organizationId: null,
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
	testimonials: {
		...defaultSection,
		id: "testimonial",
		name: "Testimonials",
		items: [],
	},
	teams: {
		// Add this section
		...defaultSection,
		id: "team",
		name: "Team",
		items: [],
	},
};

export * from "./certification";
export * from "./education";
export * from "./experience";
export * from "./hackathon";
export * from "./language";
export * from "./profile";
export * from "./project";
export * from "./skill";
export * from "./testimonial";
export * from "./team"; // Add this line
