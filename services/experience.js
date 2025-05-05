"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { experienceSchema } from "@/schema/sections";
import { COOKIE_NAME } from "@/utils/constants";

const experienceSelect = {
	id: true,
	visible: true,
	company: true,
	position: true,
	location: true,
	date: true,
	summary: true,
	picture: true,
	url: true,
	technologies: true,
	portfolioId: true,
	// Exclude createdAt and updatedAt
};

export async function getExperiences(portfolioId) {
	return withErrorHandling(async () => {
		const experiences = await prisma.experience.findMany({
			where: { portfolioId },
			select: experienceSelect,
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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
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
			select: experienceSelect,
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return experienceSchema.parse(exp);
	});
}

export async function editExperience(experienceId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
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
			select: experienceSelect,
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return experienceSchema.parse(updatedExp);
	});
}

export async function deleteExperience(experienceId, portfolioId) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
			throw new Error("Unauthorized");
		}

		await prisma.experience.delete({
			where: { id: experienceId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { experienceId, portfolioId };
	});
}
