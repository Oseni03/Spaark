"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { defaultBasics, basicsSchema } from "@/schema/sections/basics";

const select = {
	id: true,
	createdAt: false,
	updatedAt: false,
	name: true,
	headline: true,
	email: true,
	phone: true,
	location: true,
	url: true,
	picture: true,
	summary: true,
	about: true,
	portfolioId: true,
};

export async function createBasics(portfolioId, data = defaultBasics) {
	return withErrorHandling(async () => {
		if (!portfolioId) {
			throw new Error("Portfolio ID is required");
		}
		const portfolioExists = await prisma.portfolio.findUnique({
			where: { id: portfolioId },
		});

		if (!portfolioExists) {
			throw new Error("Portfolio does not exist");
		}
		// Create User with Basics
		// Upsert basics with provided or default data
		const basics = await prisma.basics.upsert({
			where: { portfolioId },
			update: {
				...data,
				portfolioId,
			},
			create: {
				...data,
				portfolioId,
			},
			select,
		});
		return basicsSchema.parse(basics);
	});
}

export async function updatePortfolioBasics({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Update user in database
		const updatedBasics = await prisma.basics.update({
			where: { portfolioId },
			data: {
				...data,
				updatedAt: new Date(), // Ensure updated timestamp is set
			},
			select,
		});

		// Revalidate the path to update cached data
		revalidatePath("/builder");

		return basicsSchema.parse(updatedBasics);
	});
}

// Fetch user basics server action
export async function getBasics(portfolioId) {
	return withErrorHandling(async () => {
		if (!portfolioId) {
			throw new Error("Unauthorized");
		}

		// Fetch user from database
		const userData = await prisma.basics.findUnique({
			where: { portfolioId },
			select,
		});

		if (!userData) {
			throw new Error("User not found");
		}

		// Validate the fetched data against the schema
		return basicsSchema.parse(userData);
	});
}
