"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { defaultBasics } from "@/schema/sections/basics";
import { transformPortfolio } from "@/lib/utils";

const portfolioSelect = {
	id: true,
	name: true,
	slug: true,
	isLive: true,
	blogEnabled: true,
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
	testimonials: true,
	teams: true,
};

export async function getAllPortfolios() {
	return withErrorHandling(async () => {
		const portfolios = await prisma.portfolio.findMany({
			where: { isLive: true },
			select: portfolioSelect,
		});

		return portfolios.length > 0 ? portfolios : [];
	});
}

export async function getPortfolios(userId, orgId = null) {
	return withErrorHandling(async () => {
		if (!userId) {
			throw new Error("User Id required");
		}

		const whereClause = {
			OR: [{ userId }],
		};

		// Add organization condition if orgId exists
		if (orgId) {
			whereClause.OR.push({ organizationId: orgId });
		}

		const portfolios = await prisma.portfolio.findMany({
			where: whereClause,
			select: portfolioSelect,
		});

		return portfolios.length > 0 ? portfolios : [];
	});
}

export async function createPortfolio(data) {
	return withErrorHandling(async () => {
		const { userId, orgId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const portfolio = await prisma.portfolio.create({
			data: {
				...data,
				organizationId: orgId || null,
				user: { connect: { id: userId } },
				basics: {
					create: defaultBasics,
				},
			},
			select: portfolioSelect,
		});
		return transformPortfolio(portfolio);
	});
}

// Helper function to filter valid basics fields
const getValidBasicsUpdateFields = (basics) => {
	const validFields = [
		"name",
		"headline",
		"email",
		"phone",
		"location",
		"url",
		"picture",
		"summary",
		"about",
		"updatedAt",
	];

	return Object.keys(basics)
		.filter((key) => validFields.includes(key))
		.reduce((obj, key) => {
			obj[key] = basics[key];
			return obj;
		}, {});
};

export async function editPortfolio(id, data) {
	return withErrorHandling(async () => {
		const { userId, orgId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const whereClause = {
			id,
			OR: [{ userId }],
		};

		if (orgId) {
			whereClause.OR.push({ organizationId: orgId });
		}

		// Extract main portfolio fields
		const {
			basics,
			profiles,
			experiences,
			educations,
			skills,
			certifications,
			projects,
			hackathons,
			testimonials,
			teams,
			...portfolioData
		} = data;

		// Remove id from portfolioData if it exists
		delete portfolioData.id;

		// Update the portfolio with only top-level fields
		const updatedPortfolio = await prisma.portfolio.update({
			where: whereClause,
			data: {
				...portfolioData,
				updatedAt: new Date(),
				// Update basics if provided
				...(basics && {
					basics: {
						update: {
							...getValidBasicsUpdateFields(basics),
							updatedAt: new Date(),
						},
					},
				}),
			},
			select: portfolioSelect,
		});

		return transformPortfolio(updatedPortfolio);
	});
}

export async function deletePortfolio(id) {
	return withErrorHandling(async () => {
		const { userId, orgId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a portfolio"
			);
		}

		const whereClause = {
			id,
			OR: [{ userId }],
		};

		if (orgId) {
			whereClause.OR.push({ organizationId: orgId });
		}

		const deletedPortfolio = await prisma.portfolio.delete({
			where: whereClause,
			select: portfolioSelect,
		});

		return deletedPortfolio;
	});
}

export async function getPortfolioBySlug(slug) {
	return withErrorHandling(async () => {
		const portfolio = await prisma.portfolio.findUnique({
			where: { slug },
			select: portfolioSelect,
		});
		return portfolio;
	});
}

export async function getPortfolio(domain) {
	return withErrorHandling(async () => {
		const portfolio = await prisma.portfolio.findFirst({
			where: {
				OR: [{ customDomain: domain }, { slug: domain }],
				isLive: true,
			},
			select: portfolioSelect,
		});

		return portfolio;
	});
}
