import { siteConfig } from "@/config/site";
import {
	certificationSchema,
	educationSchema,
	experienceSchema,
	hackathonSchema,
	profileSchema,
	projectSchema,
	skillSchema,
} from "@/schema/sections";
import { defaultBasics } from "@/schema/sections/basics";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getInitials(fullName) {
	try {
		return fullName
			.split(" ")
			.map((word) => word[0]?.toUpperCase())
			.join("");
	} catch (error) {
		console.log("getInitials error: ", error);
		return "";
	}
}

export function isTrialing(createdAt) {
	const currentDate = new Date();
	const userDate = new Date(createdAt);
	const differenceInMs = currentDate - userDate;
	const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

	return differenceInDays < 14;
}

export const logger = {
	info: (...args) => console.log(`[${siteConfig.name}]`, ...args),
	error: (...args) => console.log(`[${siteConfig.name}: Error]`, ...args),
};

export const transformPortfolio = (portfolio) => {
	// Transform each section to include name, visible, id and items properties
	const transformedSections = {
		certifications: {
			name: "Certifications",
			visible: true,
			id: "certification",
			items:
				portfolio?.certifications.map((cert) =>
					certificationSchema.parse(cert)
				) || [],
		},
		educations: {
			name: "Education",
			visible: true,
			id: "education",
			items:
				portfolio?.educations.map((edu) =>
					educationSchema.parse(edu)
				) || [],
		},
		experiences: {
			name: "Experience",
			visible: true,
			id: "experience",
			items:
				portfolio?.experiences.map((exp) =>
					experienceSchema.parse(exp)
				) || [],
		},
		hackathons: {
			name: "Hackathons",
			visible: true,
			id: "hackathon",
			items:
				portfolio?.hackathons.map((hack) =>
					hackathonSchema.parse(hack)
				) || [],
		},
		profiles: {
			name: "Profiles",
			visible: true,
			id: "profile",
			items:
				portfolio?.profiles.map((prof) => profileSchema.parse(prof)) ||
				[],
		},
		projects: {
			name: "Projects",
			visible: true,
			id: "project",
			items:
				portfolio?.projects.map((proj) => projectSchema.parse(proj)) ||
				[],
		},
		skills: {
			name: "Skills",
			visible: true,
			id: "skill",
			items:
				portfolio?.skills.map((skill) => skillSchema.parse(skill)) ||
				[],
		},
	};

	// Transform basics section to include name and visible properties
	const transformedBasics = {
		name: "Basics",
		visible: true,
		...defaultBasics,
		...portfolio.basics,
	};

	// Return transformed portfolio object with organization data
	return {
		id: portfolio.id,
		name: portfolio.name,
		slug: portfolio.slug,
		isPublic: portfolio.isPublic,
		isPrimary: portfolio.isPrimary,
		customDomain: portfolio.customDomain,
		template: portfolio.template,
		organizationId: portfolio.organizationId,
		basics: transformedBasics,
		...transformedSections,
	};
};
