"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { profileSchema } from "@/schema/sections";

export async function getProfiles(portfolioId) {
	return withErrorHandling(async () => {
		const profiles = await prisma.profile.findMany({
			where: { portfolioId },
			select: {
				id: true,
				visible: true,
				network: true,
				username: true,
				url: true,
			},
		});
		if (profiles.length > 0) {
			return profiles.map((item) => profileSchema.parse(item));
		}
		return [];
	});
}

export async function createProfile({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Create profile with additional metadata
		const profile = await prisma.profile.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
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
			where: { id: profileId, portfolioId: data.portfolioId },
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

export async function deleteProfile(profileId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a profile"
			);
		}

		const existingProfile = await prisma.profile.findUnique({
			where: { id: profileId, portfolioId },
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
