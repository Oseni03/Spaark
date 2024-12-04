import { z } from "zod";

import { certificationSchema } from "./certification";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { languageSchema } from "./language";
import { profileSchema } from "./profile";
import { projectSchema } from "./project";
import { skillSchema } from "./skill";
import { hackathonSchema } from "./hackathon";

// Schema
export const sectionSchema = z.object({
	name: z.string(),
	columns: z.number().min(1).max(5).default(1),
	separateLinks: z.boolean().default(true),
	visible: z.boolean().default(true),
});

// Schema
export const sectionsSchema = z.object({
	summary: sectionSchema.extend({
		id: z.literal("summary"),
		content: z.string().default(""),
	}),
	about: sectionSchema.extend({
		id: z.literal("about"),
		content: z.string().default(""),
	}),
	certifications: sectionSchema.extend({
		id: z.literal("certifications"),
		items: z.array(certificationSchema),
	}),
	education: sectionSchema.extend({
		id: z.literal("education"),
		items: z.array(educationSchema),
	}),
	experience: sectionSchema.extend({
		id: z.literal("experience"),
		items: z.array(experienceSchema),
	}),
	hackathon: sectionSchema.extend({
		id: z.literal("hackathon"),
		items: z.array(hackathonSchema),
	}),
	languages: sectionSchema.extend({
		id: z.literal("languages"),
		items: z.array(languageSchema),
	}),
	profiles: sectionSchema.extend({
		id: z.literal("profiles"),
		items: z.array(profileSchema),
	}),
	projects: sectionSchema.extend({
		id: z.literal("projects"),
		items: z.array(projectSchema),
	}),
	skills: sectionSchema.extend({
		id: z.literal("skills"),
		items: z.array(skillSchema),
	}),
});

// Defaults
export const defaultSection = {
	name: "",
	columns: 1,
	separateLinks: true,
	visible: true,
};

export const defaultSections = {
	summary: { ...defaultSection, id: "summary", name: "Summary", content: "" },
	about: { ...defaultSection, id: "about", name: "About", content: "" },
	hackathon: {
		...defaultSection,
		id: "hackathon",
		name: "Hackathon",
		items: [],
	},
	certifications: {
		...defaultSection,
		id: "certifications",
		name: "Certifications",
		items: [],
	},
	education: {
		...defaultSection,
		id: "education",
		name: "Education",
		items: [],
	},
	experience: {
		...defaultSection,
		id: "experience",
		name: "Experience",
		items: [],
	},
	languages: {
		...defaultSection,
		id: "languages",
		name: "Languages",
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
