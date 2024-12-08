"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Comprehensive error handling utility
export async function withErrorHandling(action) {
	try {
		const result = await action();
		return { success: true, data: result };
	} catch (error) {
		console.log("Server Action Error:", error);

		// Specific error type handling
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join("; "),
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: false,
			error: "An unexpected error occurred",
		};
	}
}

export async function createProfile(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create profile with additional metadata
		const profile = await prisma.profile.create({
			data: {
				...data,
				userId,
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return profile;
	});
}

export async function editProfile(profileId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingProfile = await prisma.profile.findUnique({
			where: { id: profileId, userId },
		});

		if (!existingProfile) {
			throw new Error(
				"Profile not found or you do not have permission to update"
			);
		}

		const updatedProfile = await prisma.profile.update({
			where: { id: profileId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedProfile;
	});
}

export async function deleteProfile(profileId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a profile"
			);
		}

		const existingProfile = await prisma.profile.findUnique({
			where: { id: profileId, userId },
		});

		if (!existingProfile) {
			throw new Error(
				"Profile not found or you do not have permission to delete"
			);
		}

		const deletedProfile = await prisma.profile.delete({
			where: { id: profileId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedProfile;
	});
}
