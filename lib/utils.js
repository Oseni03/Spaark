import { siteConfig } from "@/config/site";
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
