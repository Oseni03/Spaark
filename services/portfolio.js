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
				customDomain: true,
				organizationId: true,
				template: true,
				basics: true,
				profiles: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
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
				basics: {
					create: defaultBasics,
				},
			},
			select: {
				id: true,
				name: true,
				slug: true,
				isPublic: true,
				isPrimary: true,
				customDomain: true,
				organizationId: true,
				template: true,
				basics: true,
				profiles: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});
		return portfolio;
	});
}

export async function editPortfolio(id, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const updatedPortfolio = await prisma.portfolio.update({
			where: { id, userId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		return updatedPortfolio;
	});
}

export async function deletePortfolio(id) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a portfolio"
			);
		}

		const deletedPortfolio = await prisma.portfolio.delete({
			where: { id, userId },
		});

		return deletedPortfolio;
	});
}

export async function getPortfolioBySlug(slug) {
	return withErrorHandling(async () => {
		const portfolio = await prisma.portfolio.findUnique({
			where: { slug },
			select: {
				id: true,
				name: true,
				slug: true,
				isPublic: true,
				isPrimary: true,
				customDomain: true,
				organizationId: true,
				template: true,
				basics: true,
				profiles: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});
		return portfolio;
	});
}

export async function getPortfolio(domain) {
	return withErrorHandling(async () => {
		// Try to find portfolio by custom domain first
		let portfolio = await prisma.portfolio.findFirst({
			where: { customDomain: domain },
			select: {
				id: true,
				name: true,
				slug: true,
				isPublic: true,
				isPrimary: true,
				customDomain: true,
				organizationId: true,
				template: true,
				basics: true,
				profiles: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});

		// If not found by custom domain, try slug
		if (!portfolio) {
			portfolio = await prisma.portfolio.findFirst({
				where: { slug: domain },
				select: {
					id: true,
					name: true,
					slug: true,
					isPublic: true,
					isPrimary: true,
					customDomain: true,
					organizationId: true,
					template: true,
					basics: true,
					profiles: true,
					experiences: true,
					educations: true,
					skills: true,
					certifications: true,
					projects: true,
					hackathons: true,
				},
			});
		}

		if (!portfolio || !portfolio.isPublic) {
			return null;
		}

		return portfolio;
	});
}
