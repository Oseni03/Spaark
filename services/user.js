"use server";

import { basicsSchema } from "@/schema/basics";
import { prisma } from "@/lib/db"; // Assume this is your database connection
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { defaultBasics } from "@/schema/basics";
import { withErrorHandling } from "./shared";

export async function createUserBasics(userId, data = defaultBasics) {
	return withErrorHandling(async () => {
		// Create User with Basics
		const basics = await prisma.basics.upsert({
			where: { userId },
			data: {
				...data,
				userId,
			},
		});
		return basics;
	});
}

// Update user basics server action
export async function updateUserBasics(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Update user in database
		const updatedBasics = await prisma.basics.update({
			where: { userId },
			data: data,
		});

		// Revalidate the path to update cached data
		revalidatePath("/builder");

		return updatedBasics;
	});
}

// Fetch user basics server action
export async function getUserBasics(userId) {
	return withErrorHandling(async () => {
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Fetch user from database
		const userData = await prisma.basics.findUnique({
			where: { userId },
			select: {
				name: true,
				headline: true,
				email: true,
				phone: true,
				location: true,
				url: true,
				picture: true,
				summary: true,
				about: true,
			},
		});

		if (!userData) {
			throw new Error("User not found");
		}

		// Validate the fetched data against the schema
		return basicsSchema.parse(userData);
	});
}

// Utility function for file upload (implement based on your storage solution)
async function uploadToStorage(file, filename) {
	// This is a placeholder - replace with actual file upload logic
	// Could be AWS S3, Google Cloud Storage, local filesystem, etc.
	return {
		url: `/uploads/${filename}`,
		// other metadata
	};
}
