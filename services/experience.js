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
			},
		});
		if (experiences.length > 0) {
			return experiences.map((item) => experienceSchema.parse(item));
		}
		return [];
	});
}

export async function createExperience(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create experience with additional metadata
		const exp = await prisma.experience.create({
			data: {
				...data,
				portfolio: { connect: { id: data.portfolioId } },
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return exp;
	});
}

export async function editExperience(experienceId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingExperience = await prisma.experience.findUnique({
			where: { id: experienceId, portfolioId: data.portfolioId },
		});

		if (!existingExperience) {
			throw new Error(
				"Experience not found or you do not have permission to update"
			);
		}

		const updatedExp = await prisma.experience.update({
			where: { id: experienceId },
			data: {
				...data,
				updatedAt: new Date(),
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
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete an experience"
			);
		}

		const existingExperience = await prisma.experience.findUnique({
			where: { id: experienceId, portfolioId },
		});

		if (!existingExperience) {
			throw new Error(
				"Experience not found or you do not have permission to delete"
			);
		}

		const deletedExp = await prisma.experience.delete({
			where: { id: experienceId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedExp;
	});
}
