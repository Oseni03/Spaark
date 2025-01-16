"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { certificationSchema } from "@/schema/sections";

export async function getCertifications(portfolioId) {
	return withErrorHandling(async () => {
		const certifications = await prisma.certification.findMany({
			where: { portfolioId },
			select: {
				id: true,
				visible: true,
				name: true,
				issuer: true,
				date: true,
				summary: true,
				url: true,
			},
		});
		if (certifications.length > 0) {
			return certifications.map((item) =>
				certificationSchema.parse(item)
			);
		}
		return [];
	});
}

export async function createCertification(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create certification with additional metadata
		const certification = await prisma.certification.create({
			data: {
				...data,
				portfolio: { connect: { id: data.portfolioId } },
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return certification;
	});
}

export async function editCertification(certificationId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		if (!certificationId) {
			throw new Error("Certification Id required");
		}

		const existingCertification = await prisma.certification.findUnique({
			where: { id: certificationId, portfolioId: data.portfolioId },
		});

		if (!existingCertification) {
			throw new Error(
				"Certification not found or you do not have permission to update"
			);
		}

		const updatedCertification = await prisma.certification.update({
			where: { id: certificationId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedCertification;
	});
}

export async function deleteCertification(certificationId, portfolioId) {
	return withErrorHandling(async () => {
		if (!certificationId) {
			throw new Error("Certification Id required");
		}

		const existingCertification = await prisma.certification.findUnique({
			where: { id: certificationId, portfolioId },
		});

		if (!existingCertification) {
			throw new Error(
				"Certification not found or you do not have permission to delete"
			);
		}

		const deletedCertification = await prisma.certification.delete({
			where: { id: certificationId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedCertification;
	});
}
