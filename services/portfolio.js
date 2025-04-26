"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { defaultBasics } from "@/schema/sections/basics";
import { transformPortfolio } from "@/lib/utils";
import { COOKIE_NAME } from "@/utils/constants";

const portfolioSelect = {
	id: true,
	name: true,
	slug: true,
	isLive: true,
	blogEnabled: true,
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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
			throw new Error("Unauthorized");
		}

		const userId = decodedToken.uid;
		const { portfolioId, ...basicsData } = defaultBasics;

		const portfolio = await prisma.portfolio.create({
			data: {
				...data,
				user: { connect: { id: userId } },
				basics: {
					create: {
						...basicsData,
					},
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
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
			throw new Error("Unauthorized");
		}

		const userId = decodedToken.uid;

		// Extract main portfolio fields
		const { id: portfolioId, ...portfolioData } = data;

		const updatedPortfolio = await prisma.portfolio.update({
			where: {
				id,
				userId,
			},
			data: {
				...portfolioData,
				updatedAt: new Date(),
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
