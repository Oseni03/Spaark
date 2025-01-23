"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { educationSchema } from "@/schema/sections";

export async function getEducations(portfolioId) {
	return withErrorHandling(async () => {
		const educations = await prisma.education.findMany({
			where: { portfolioId },
			select: {
				id: true,
				visible: true,
				institution: true,
				studyType: true,
				date: true,
				summary: true,
				logo: true,
				url: true,
				portfolioId: true,
			},
		});
		if (educations.length > 0) {
			return educations.map((item) => educationSchema.parse(item));
		}
		return [];
	});
}

export async function createEducation({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Create education with additional metadata
		const edu = await prisma.education.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select: {
				id: true,
				visible: true,
				institution: true,
				studyType: true,
				date: true,
				summary: true,
				logo: true,
				url: true,
				portfolioId: true,
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return edu;
	});
}

export async function editEducation(educationId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const updatedEdu = await prisma.education.update({
			where: { id: educationId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				visible: true,
				institution: true,
				studyType: true,
				date: true,
				summary: true,
				logo: true,
				url: true,
				portfolioId: true,
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedEdu;
	});
}

export async function deleteEducation(educationId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a education"
			);
		}

		await prisma.education.delete({
			where: { id: educationId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { educationId, portfolioId };
	});
}
