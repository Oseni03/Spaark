"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { educationSchema } from "@/schema/sections";
import { COOKIE_NAME } from "@/utils/constants";

const educationSelect = {
	id: true,
	visible: true,
	institution: true,
	studyType: true,
	date: true,
	summary: true,
	logo: true,
	url: true,
	location: true,
	portfolioId: true,
};

export async function getEducations(portfolioId) {
	return withErrorHandling(async () => {
		const educations = await prisma.education.findMany({
			where: { portfolioId },
			select: educationSelect,
		});
		if (educations.length > 0) {
			return educations.map((item) => educationSchema.parse(item));
		}
		return [];
	});
}

export async function createEducation({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Create education with additional metadata
		const edu = await prisma.education.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select: educationSelect,
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return educationSchema.parse(edu);
	});
}

export async function editEducation(educationId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const updatedEdu = await prisma.education.update({
			where: { id: educationId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: educationSelect,
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return educationSchema.parse(updatedEdu);
	});
}

export async function deleteEducation(educationId, portfolioId) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
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
