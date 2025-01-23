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
				// Exclude createdAt and updatedAt
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
			select: {
				id: true,
				visible: true,
				network: true,
				username: true,
				url: true,
				portfolioId: true,
			},
		});

		revalidatePath("/builder");
		return profile;
	});
}

export async function editProfile(profileId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const updatedProfile = await prisma.profile.update({
			where: { id: profileId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				visible: true,
				network: true,
				username: true,
				url: true,
				portfolioId: true,
			},
		});

		revalidatePath("/builder");
		return updatedProfile;
	});
}

export async function deleteProfile(profileId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a profile"
			);
		}

		await prisma.profile.delete({
			where: { id: profileId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { portfolioId, profileId };
	});
}
