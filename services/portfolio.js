"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { defaultBasics } from "@/schema/sections/basics";

export async function getPortfolios(userId) {
	if (!userId) {
		throw new Error("User Id required");
	}

	return withErrorHandling(async () => {
		const portfolios = await prisma.portfolio.findMany({
			where: { userId },
			select: {
				id: true,
				name: true,
				slug: true,
				isPublic: true,
				isPrimary: true,
				organizationId: true,
			},
		});
		if (portfolios.length > 0) {
			return portfolios;
		}
		return [];
	});
}

export async function createPortfolio(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const portfolio = await prisma.portfolio.create({
			data: {
				...data,
				user: { connect: { id: userId } },
				basics: defaultBasics,
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return portfolio;
	});
}

export async function editPortfolio(portfolioId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingPortfolio = await prisma.portfolio.findUnique({
			where: { id: portfolioId, userId },
		});

		if (!existingPortfolio) {
			throw new Error(
				"Portfolio not found or you do not have permission to update"
			);
		}

		const updatedPortfolio = await prisma.portfolio.update({
			where: { id: portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedPortfolio;
	});
}

export async function deletePortfolio(portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a portfolio"
			);
		}

		const existingPortfolio = await prisma.portfolio.findUnique({
			where: { id: portfolioId, userId },
		});

		if (!existingPortfolio) {
			throw new Error(
				"Portfolio not found or you do not have permission to delete"
			);
		}

		const deletedPortfolio = await prisma.portfolio.delete({
			where: { id: portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedPortfolio;
	});
}
