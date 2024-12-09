import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getInitials(fullName) {
	return fullName
		.split(" ")
		.map((word) => word[0].toUpperCase())
		.join("");
}
