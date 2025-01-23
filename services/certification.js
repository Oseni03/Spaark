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
				portfolioId: true,
				// Exclude createdAt and updatedAt
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

export async function createCertification({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const certification = await prisma.certification.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select: {
				id: true,
				visible: true,
				name: true,
				issuer: true,
				date: true,
				summary: true,
				url: true,
				portfolioId: true,
			},
		});

		revalidatePath("/builder");
		return certification;
	});
}

export async function editCertification(
	certificationId,
	{ portfolioId, ...data }
) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		if (!certificationId || !portfolioId) {
			throw new Error("Certification Id required");
		}

		const updatedCertification = await prisma.certification.update({
			where: { id: certificationId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				visible: true,
				name: true,
				issuer: true,
				date: true,
				summary: true,
				url: true,
				portfolioId: true,
			},
		});

		revalidatePath("/builder");
		return updatedCertification;
	});
}

export async function deleteCertification(certificationId, portfolioId) {
	return withErrorHandling(async () => {
		if (!certificationId || !portfolioId) {
			throw new Error("Certification Id required");
		}

		await prisma.certification.delete({
			where: { id: certificationId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { certificationId, portfolioId };
	});
}
