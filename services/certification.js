"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { certificationSchema } from "@/schema/sections";
import { COOKIE_NAME } from "@/utils/constants";

const certificationSelect = {
	id: true,
	visible: true,
	name: true,
	issuer: true,
	date: true,
	summary: true,
	url: true,
	portfolioId: true,
	// Exclude createdAt and updatedAt
};

export async function getCertifications(portfolioId) {
	return withErrorHandling(async () => {
		const certifications = await prisma.certification.findMany({
			where: { portfolioId },
			select: certificationSelect,
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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
			throw new Error("Unauthorized");
		}

		const certification = await prisma.certification.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select: certificationSelect,
		});

		revalidatePath("/builder");
		return certificationSchema.parse(certification);
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
			select: certificationSelect,
		});

		revalidatePath("/builder");
		return certificationSchema.parse(updatedCertification);
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
