import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getInitials(fullName) {
	try {
		return fullName
			.split(" ")
			.map((word) => word[0].toUpperCase())
			.join("");
	} catch (error) {
		console.log("getInitials error: ", error);
		return "";
	}
}
