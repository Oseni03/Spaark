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
import { parseISO, format } from "date-fns";
import {
	GithubIcon,
	LinkedinIcon,
	TwitterIcon,
	YoutubeIcon,
} from "lucide-react";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const cx = (...classNames) => classNames.filter(Boolean).join(" ");

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

// Replace serializeDate with a safer version
const serializeDate = (date) => {
	if (!date) return null;
	try {
		const d = typeof date === "string" ? new Date(date) : date;
		if (!(d instanceof Date) || isNaN(d.getTime())) return null;
		return d.toISOString();
	} catch {
		return null;
	}
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

export const isUrl = (string) => {
	if (!string) return false;

	const urlRegex = /https?:\/\/[^\n ]+/i;

	return urlRegex.test(string);
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

	// Helper to transform section items with safe date serialization
	const mapSectionItems = (items, schema) =>
		Array.isArray(items)
			? items.map((item) => {
					const parsed = schema.safeParse(item);
					const base = parsed.success ? parsed.data : {};
					return {
						...base,
						createdAt: serializeDate(item.createdAt),
						updatedAt: serializeDate(item.updatedAt),
					};
				})
			: [];

	// Transform each section, matching mainSchema
	const transformedSections = {
		certifications: {
			id: "certification",
			name: "Certifications",
			visible: true,
			items: mapSectionItems(
				portfolio?.certifications,
				certificationSchema
			),
		},
		educations: {
			id: "education",
			name: "Education",
			visible: true,
			items: mapSectionItems(portfolio?.educations, educationSchema),
		},
		experiences: {
			id: "experience",
			name: "Experience",
			visible: true,
			items: mapSectionItems(portfolio?.experiences, experienceSchema),
		},
		hackathons: {
			id: "hackathon",
			name: "Hackathons",
			visible: true,
			items: mapSectionItems(portfolio?.hackathons, hackathonSchema),
		},
		socials: {
			id: "social",
			name: "Socials",
			visible: true,
			items: mapSectionItems(portfolio?.socials, socialSchema),
		},
		projects: {
			id: "project",
			name: "Projects",
			visible: true,
			items: mapSectionItems(portfolio?.projects, projectSchema),
		},
		skills: {
			id: "skill",
			name: "Skills",
			visible: true,
			items: mapSectionItems(portfolio?.skills, skillSchema),
		},
	};

	// Return transformed and serialized portfolio object matching mainSchema
	return {
		id: portfolio.id,
		name: portfolio.name,
		slug: portfolio.slug,
		isLive: portfolio.isLive,
		blogEnabled: portfolio.blogEnabled,
		template: portfolio.template || "default",
		customDomain: portfolio.customDomain ?? null,
		domainVerified: portfolio.domainVerified ?? false,
		createdAt: serializeDate(portfolio.createdAt),
		updatedAt: serializeDate(portfolio.updatedAt),
		basics: transformedBasics,
		...transformedSections,
	};
};

export const getSocialLink = (social) => {
	logger.info("Social links param: ", { social });
	if (social.network.toLowerCase() === "github") {
		return `https://github.com/${social.username}`;
	} else if (social.network.toLowerCase() === "linkedin") {
		return `https://linkedin.com/in/${social.username}`;
	} else if (social.network.toLowerCase() === "x") {
		return `https://x.com/${social.username}`;
	} else if (social.network.toLowerCase() === "youtube") {
		return `https://youtube.com/${social.username}`;
	}
	return "";
};

export const getSocialIcon = (social, { size = 20, className = "" } = {}) => {
	if (!social || !social.network) return null;
	if (social.network.toLowerCase() === "github")
		return <GithubIcon size={size} className={className} />;
	else if (social.network.toLowerCase() === "linkedin")
		return <LinkedinIcon size={size} className={className} />;
	else if (social.network.toLowerCase() === "twitter")
		return <TwitterIcon size={size} className={className} />;
	else if (social.network.toLowerCase() === "youtube")
		return <YoutubeIcon size={size} className={className} />;
	return null;
};
