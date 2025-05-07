import { siteConfig } from "@/config/site";
import {
	certificationSchema,
	educationSchema,
	experienceSchema,
	hackathonSchema,
	socialSchema,
	projectSchema,
	skillSchema,
} from "@/schema/sections";
import { defaultBasics } from "@/schema/sections/basics";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	adjectives,
	animals,
	uniqueNamesGenerator,
} from "unique-names-generator";

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

export function formatDate(date) {
	if (!date) return "";
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

const isClient = typeof window !== "undefined";
const isDev = process.env.NODE_ENV === "development";

const noopLogger = {
	info: () => {},
	error: () => {},
	warn: () => {},
	debug: () => {},
};

const devLogger = {
	info: (...args) => isDev && console.log("[INFO]", ...args),
	error: (...args) => isDev && console.log("[ERROR]", ...args),
	warn: (...args) => isDev && console.log("[WARN]", ...args),
	debug: (...args) => isDev && console.log("[DEBUG]", ...args),
};

// Use noop logger in production, dev logger in development
export const logger = isDev ? devLogger : noopLogger;
export const sortByDate = (a, b) => {
	const dateA = a.publishedAt || a.updatedAt;
	const dateB = b.publishedAt || b.updatedAt;
	return new Date(dateB) - new Date(dateA);
};

const serializeDate = (date) => {
	if (!date) return null;
	if (typeof date === "string") return date;
	if (date instanceof Date) return date.toISOString();
	return null;
};

export const generateRandomName = (options) => {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, adjectives, animals],
		style: "capital",
		separator: " ",
		length: 3,
		...options,
	});
};

export const transformPortfolio = (portfolio) => {
	logger.info("Transforming portfolio data", portfolio);

	// Serialize dates in basics
	const serializedBasics = portfolio?.basics
		? {
				...portfolio.basics,
				createdAt: serializeDate(portfolio.basics.createdAt),
				updatedAt: serializeDate(portfolio.basics.updatedAt),
			}
		: null;

	// Transform basics section
	const transformedBasics = {
		name: "Basics",
		visible: true,
		...defaultBasics,
		...(serializedBasics || {}),
	};

	// Transform each section
	const transformedSections = {
		certifications: {
			name: "Certifications",
			visible: true,
			id: "certification",
			items: Array.isArray(portfolio?.certifications)
				? portfolio.certifications.map((cert) => ({
						...certificationSchema.parse(cert),
						createdAt: serializeDate(cert.createdAt),
						updatedAt: serializeDate(cert.updatedAt),
					}))
				: [],
		},
		educations: {
			name: "Education",
			visible: true,
			id: "education",
			items: Array.isArray(portfolio?.educations)
				? portfolio.educations.map((edu) => ({
						...educationSchema.parse(edu),
						createdAt: serializeDate(edu.createdAt),
						updatedAt: serializeDate(edu.updatedAt),
					}))
				: [],
		},
		experiences: {
			name: "Experience",
			visible: true,
			id: "experience",
			items: Array.isArray(portfolio?.experiences)
				? portfolio.experiences.map((exp) => ({
						...experienceSchema.parse(exp),
						createdAt: serializeDate(exp.createdAt),
						updatedAt: serializeDate(exp.updatedAt),
					}))
				: [],
		},
		hackathons: {
			name: "Hackathons",
			visible: true,
			id: "hackathon",
			items: Array.isArray(portfolio?.hackathons)
				? portfolio.hackathons.map((hack) => ({
						...hackathonSchema.parse(hack),
						createdAt: serializeDate(hack.createdAt),
						updatedAt: serializeDate(hack.updatedAt),
					}))
				: [],
		},
		socials: {
			name: "Socials",
			visible: true,
			id: "social",
			items: Array.isArray(portfolio?.socials)
				? portfolio.socials.map((social) => ({
						...socialSchema.parse(social),
						createdAt: serializeDate(social.createdAt),
						updatedAt: serializeDate(social.updatedAt),
					}))
				: [],
		},
		projects: {
			name: "Projects",
			visible: true,
			id: "project",
			items: Array.isArray(portfolio?.projects)
				? portfolio.projects.map((proj) => ({
						...projectSchema.parse(proj),
						createdAt: serializeDate(proj.createdAt),
						updatedAt: serializeDate(proj.updatedAt),
					}))
				: [],
		},
		skills: {
			name: "Skills",
			visible: true,
			id: "skill",
			items: Array.isArray(portfolio?.skills)
				? portfolio.skills.map((skill) => ({
						...skillSchema.parse(skill),
						createdAt: serializeDate(skill.createdAt),
						updatedAt: serializeDate(skill.updatedAt),
					}))
				: [],
		},
	};

	// Return transformed and serialized portfolio object
	return {
		id: portfolio.id,
		name: portfolio.name,
		slug: portfolio.slug,
		isLive: portfolio.isLive,
		blogEnabled: portfolio.blogEnabled,
		customDomain: portfolio.customDomain,
		template: portfolio.template,
		createdAt: serializeDate(portfolio.createdAt),
		updatedAt: serializeDate(portfolio.updatedAt),
		basics: transformedBasics,
		...transformedSections,
	};
};
