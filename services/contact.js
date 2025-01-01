"use server";

import { withErrorHandling } from "./shared";
import { prisma } from "@/lib/db";

export async function saveContact({ email, full_name, message }) {
	return withErrorHandling(async () => {
		if (!email || !full_name || !message) {
			throw new Error("All fields are required.");
		}
		const contact = await prisma.contact.create({
			data: {
				email,
				full_name,
				message,
			},
		});
		return contact;
	});
}
