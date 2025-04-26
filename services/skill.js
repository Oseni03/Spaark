"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { skillSchema } from "@/schema/sections";
import { COOKIE_NAME } from "@/utils/constants";

const select = {
	id: true,
	visible: true,
	name: true,
	description: true,
	portfolioId: true,
	// Exclude createdAt and updatedAt
};

export async function getSkills(portfolioId) {
	return withErrorHandling(async () => {
		const skills = await prisma.skill.findMany({
			where: { portfolioId },
			select,
		});
		if (skills.length > 0) {
			return skills.map((item) => skillSchema.parse(item));
		}
		return [];
	});
}

export async function createSkill({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Create skill with additional metadata
		const skill = await prisma.skill.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select,
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return skillSchema.parse(skill);
	});
}

export async function editSkill(skillId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const existingSkill = await prisma.skill.findUnique({
			where: { id: skillId, portfolioId },
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
			select,
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return skillSchema.parse(updatedSkill);
	});
}

export async function deleteSkill(skillId, portfolioId) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a skill"
			);
		}

		const existingSkill = await prisma.skill.findUnique({
			where: { id: skillId, portfolioId },
		});

		if (!existingSkill) {
			throw new Error(
				"Skill not found or you do not have permission to delete"
			);
		}

		await prisma.skill.delete({
			where: { id: skillId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { skillId, portfolioId };
	});
}
