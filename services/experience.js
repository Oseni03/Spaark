"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { experienceSchema } from "@/schema/sections";

export async function getExperiences(portfolioId) {
	return withErrorHandling(async () => {
		const experiences = await prisma.experience.findMany({
			where: { portfolioId },
			select: {
				id: true,
				visible: true,
				company: true,
				position: true,
				location: true,
				date: true,
				summary: true,
				picture: true,
				url: true,
				portfolioId: true,
				// Exclude createdAt and updatedAt
			},
		});
		if (experiences.length > 0) {
			return experiences.map((item) => experienceSchema.parse(item));
		}
		return [];
	});
}

export async function createExperience({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create experience with correct data structure
		const exp = await prisma.experience.create({
			data: {
				...data,
				portfolio: {
					connect: { id: portfolioId },
				},
			},
			select: {
				id: true,
				visible: true,
				company: true,
				position: true,
				location: true,
				date: true,
				summary: true,
				picture: true,
				url: true,
				portfolioId: true,
				// Exclude createdAt and updatedAt
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return exp;
	});
}

export async function editExperience(experienceId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const updatedExp = await prisma.experience.update({
			where: {
				id: experienceId,
				portfolioId: portfolioId,
			},
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				visible: true,
				company: true,
				position: true,
				location: true,
				date: true,
				summary: true,
				picture: true,
				url: true,
				portfolioId: true,
				// Exclude createdAt and updatedAt
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedExp;
	});
}

export async function deleteExperience(experienceId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete an experience"
			);
		}

		await prisma.experience.delete({
			where: { id: experienceId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { experienceId, portfolioId };
	});
}
