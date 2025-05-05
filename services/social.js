"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { socialSchema } from "@/schema/sections";
import { COOKIE_NAME } from "@/utils/constants";

const select = {
	id: true,
	visible: true,
	network: true,
	username: true,
	url: true,
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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a social"
			);
		}

		await prisma.social.delete({
			where: { id: socialId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { portfolioId, socialId };
	});
}
