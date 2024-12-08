"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";

export async function createSkill(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create skill with additional metadata
		const skill = await prisma.skill.create({
			data: {
				...data,
				userId,
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return skill;
	});
}

export async function editSkill(skillId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingSkill = await prisma.skill.findUnique({
			where: { id: skillId, userId },
		});

		if (!existingSkill) {
			throw new Error(
				"Skill not found or you do not have permission to update"
			);
		}

		const updatedSkill = await prisma.skill.update({
			where: { id: skillId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedSkill;
	});
}

export async function deleteSkill(skillId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a skill"
			);
		}

		const existingSkill = await prisma.skill.findUnique({
			where: { id: skillId, userId },
		});

		if (!existingSkill) {
			throw new Error(
				"Skill not found or you do not have permission to delete"
			);
		}

		const deletedSkill = await prisma.skill.delete({
			where: { id: skillId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedSkill;
	});
}
