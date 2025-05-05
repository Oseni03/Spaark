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
	// organizationId: true,
	template: true,
	basics: true,
	profiles: true,
	experiences: true,
	educations: true,
	skills: true,
	certifications: true,
	projects: true,
	hackathons: true,
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

export async function updatePortfolio(id, data) {
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

export async function updatePortfolioWithSections(id, data) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid) {
			throw new Error("Unauthorized");
		}

		const userId = decodedToken.uid;

		// First, get the existing portfolio to preserve createdAt
		const existingPortfolio = await prisma.portfolio.findUnique({
			where: { id },
			select: { createdAt: true },
		});

		if (!existingPortfolio) {
			throw new Error("Portfolio not found");
		}

		// Extract main portfolio fields and nested sections
		const {
			id: portfolioId,
			basics,
			skills,
			experiences,
			educations,
			projects,
			certifications,
			profiles,
			hackathons,
			...portfolioData
		} = data;

		// Update the portfolio with nested data
		const updatedPortfolio = await prisma.portfolio.update({
			where: {
				id,
				userId,
			},
			data: {
				...portfolioData,
				createdAt: existingPortfolio.createdAt, // Preserve the original createdAt
				updatedAt: new Date(),
				// Update basics if provided
				basics: basics
					? {
							upsert: {
								create: {
									name: basics.name,
									headline: basics.headline,
									email: basics.email,
									phone: basics.phone,
									location: basics.location,
									url: basics.url,
									picture: basics.picture,
									summary: basics.summary,
									about: basics.about,
								},
								update: {
									name: basics.name,
									headline: basics.headline,
									email: basics.email,
									phone: basics.phone,
									location: basics.location,
									url: basics.url,
									picture: basics.picture,
									summary: basics.summary,
									about: basics.about,
								},
							},
						}
					: undefined,
				// Update skills if provided
				skills:
					skills?.items?.length > 0
						? {
								deleteMany: {},
								create: skills.items.map((skill) => ({
									name: skill.name,
									description: skill.description,
									visible: skill.visible,
								})),
							}
						: undefined,
				// Update experiences if provided
				experiences:
					experiences?.items?.length > 0
						? {
								deleteMany: {},
								create: experiences.items.map((exp) => ({
									title: exp.title,
									company: exp.company,
									location: exp.location,
									startDate: exp.startDate,
									endDate: exp.endDate,
									description: exp.description,
									visible: exp.visible,
								})),
							}
						: undefined,
				// Update educations if provided
				educations:
					educations?.items?.length > 0
						? {
								deleteMany: {},
								create: educations.items.map((edu) => ({
									institution: edu.institution,
									area: edu.area,
									studyType: edu.studyType,
									startDate: edu.startDate,
									endDate: edu.endDate,
									score: edu.score,
									visible: edu.visible,
								})),
							}
						: undefined,
				// Update projects if provided
				projects:
					projects?.items?.length > 0
						? {
								deleteMany: {},
								create: projects.items.map((proj) => ({
									name: proj.name,
									description: proj.description,
									url: proj.url,
									visible: proj.visible,
								})),
							}
						: undefined,
				// Update certifications if provided
				certifications:
					certifications?.items?.length > 0
						? {
								deleteMany: {},
								create: certifications.items.map((cert) => ({
									name: cert.name,
									issuer: cert.issuer,
									date: cert.date,
									url: cert.url,
									visible: cert.visible,
								})),
							}
						: undefined,
				// Update profiles if provided
				profiles:
					profiles?.items?.length > 0
						? {
								deleteMany: {},
								create: profiles.items.map((prof) => ({
									network: prof.network,
									username: prof.username,
									url: prof.url,
									visible: prof.visible,
								})),
							}
						: undefined,
				// Update hackathons if provided
				hackathons:
					hackathons?.items?.length > 0
						? {
								deleteMany: {},
								create: hackathons.items.map((hack) => ({
									name: hack.name,
									description: hack.description,
									date: hack.date,
									url: hack.url,
									visible: hack.visible,
								})),
							}
						: undefined,
			},
			select: portfolioSelect,
		});

		return transformPortfolio(updatedPortfolio);
	});
}
