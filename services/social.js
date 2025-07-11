"use server";

import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { socialSchema } from "@/schema/sections";

const select = {
	id: true,
	visible: true,
	network: true,
	username: true,
	portfolioId: true,
	// Exclude createdAt and updatedAt
};

export async function getSocials(portfolioId) {
	return withErrorHandling(async () => {
		const socials = await prisma.social.findMany({
			where: { portfolioId },
			select,
		});
		if (socials.length > 0) {
			return socials.map((item) => socialSchema.parse(item));
		}
		return [];
	});
}

export async function createSocial({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		await verifyAuth();
		if (!portfolioId) {
			throw new Error("Portfolio ID is required");
		}

		// Create social with additional metadata
		const social = await prisma.social.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select,
		});

		revalidatePath("/builder");
		return socialSchema.parse(social);
	});
}

export async function editSocial(socialId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		await verifyAuth()

		const updatedSocial = await prisma.social.update({
			where: { id: socialId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select,
		});

		revalidatePath("/builder");
		return socialSchema.parse(updatedSocial);
	});
}

export async function deleteSocial(socialId, portfolioId) {
	return withErrorHandling(async () => {
		await verifyAuth()

		await prisma.social.delete({
			where: { id: socialId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { portfolioId, socialId };
	});
}
