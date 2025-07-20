"use server";

import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { defaultBasics } from "@/schema/sections/basics";
import { logger, transformPortfolio } from "@/lib/utils";

const portfolioSelect = {
	id: true,
	name: true,
	slug: true,
	isLive: true,
	blogEnabled: true,
	customDomain: true,
	domainVerified: true,
	template: true,
	basics: true,
	createdAt: true,
	updatedAt: true,
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
		const userId = await verifyAuth();
		const { portfolioId, ...basicsData } = defaultBasics;

		const portfolio = await prisma.portfolio.create({
			data: {
				...data,
				user: { connect: { id: userId } },
				basics: {
					create: {
						...(basicsData || defaultBasics),
					},
				},
			},
			select: portfolioSelect,
		});
		if (!portfolio) {
			throw new Error("Error creating portfolio");
		}
		logger.info("Server portfolio created: ", portfolio);
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
		const userId = await verifyAuth();

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

		if (!updatedPortfolio) {
			throw new Error("Portfolio not found");
		}

		return transformPortfolio(updatedPortfolio);
	});
}

export async function deletePortfolio(id) {
	return withErrorHandling(async () => {
		const userId = await verifyAuth();

		const whereClause = {
			id,
			OR: [{ userId }],
		};

		return await prisma.portfolio.delete({
			where: whereClause,
		});
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
				isLive: true,
				blogEnabled: true,
				customDomain: true,
				domainVerified: true,
				// organizationId: true,
				template: true,
				basics: true,
				socials: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});
		if (!portfolio) {
			throw new Error("Portfolio not found");
		}
		return transformPortfolio(portfolio);
	});
}

export async function getPortfolioById(portfolioId) {
	return withErrorHandling(async () => {
		const userId = await verifyAuth();

		const portfolio = await prisma.portfolio.findUnique({
			where: { id: portfolioId, userId },
			select: portfolioSelect,
		});

		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		return transformPortfolio(portfolio);
	});
}

export async function getDetailedPortfolio(portfolioId) {
	return withErrorHandling(async () => {
		const userId = await verifyAuth();

		const portfolio = await prisma.portfolio.findUnique({
			where: { id: portfolioId, userId },
			select: {
				id: true,
				name: true,
				slug: true,
				isLive: true,
				blogEnabled: true,
				customDomain: true,
				domainVerified: true,
				// organizationId: true,
				template: true,
				basics: true,
				socials: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});

		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		return transformPortfolio(portfolio);
	});
}

export async function getPortfolio(domain) {
	return withErrorHandling(async () => {
		const portfolio = await prisma.portfolio.findFirst({
			where: {
				OR: [{ customDomain: domain }, { slug: domain }],
				isLive: true,
			},
			select: {
				id: true,
				name: true,
				slug: true,
				isLive: true,
				blogEnabled: true,
				customDomain: true,
				domainVerified: true,
				// organizationId: true,
				template: true,
				basics: true,
				socials: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});

		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		return transformPortfolio(portfolio);
	});
}

export async function getPortfolioFromSlug(subdomain) {
	try {
		const portfolioResult = await getPortfolio(subdomain);

		if (!portfolioResult.success || !portfolioResult.data) {
			return { success: false, error: "Portfolio not found" };
		}

		const portfolio = portfolioResult.data;
		const metaTags = {
			title: portfolio.basics?.name || subdomain,
			description:
				portfolio.basics?.summary || "Welcome to my portfolio!",
			image: portfolio.basics?.picture,
			url: portfolio.customDomain
				? portfolio.customDomain
				: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		};

		return {
			success: true,
			data: { portfolio, metaTags },
		};
	} catch (error) {
		console.error("Error fetching portfolio:", error);
		return { success: false, error: "Failed to fetch portfolio" };
	}
}

export async function updatePortfolioDomain(portfolioId, domain) {
	return withErrorHandling(async () => {
		return await prisma.portfolio.update({
			where: { id: portfolioId },
			data: { customDomain: domain },
		});
	});
}

export async function getPortfolioByDomain(domain) {
	return withErrorHandling(async () => {
		const portfolio = await prisma.portfolio.findFirst({
			where: { customDomain: domain },
			select: {
				id: true,
				name: true,
				slug: true,
				isLive: true,
				blogEnabled: true,
				customDomain: true,
				domainVerified: true,
				// organizationId: true,
				template: true,
				basics: true,
				socials: true,
				experiences: true,
				educations: true,
				skills: true,
				certifications: true,
				projects: true,
				hackathons: true,
			},
		});

		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		return transformPortfolio(portfolio);
	});
}
export async function markDomainVerified(domain) {
	return withErrorHandling(async () => {
		return await prisma.portfolio.updateMany({
			where: { customDomain: domain },
			data: { domainVerified: true },
		});
	});
}

export async function updatePortfolioWithSections(id, data) {
	return withErrorHandling(async () => {
		const userId = await verifyAuth();

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
			socials,
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
									years: basics.years,
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
									years: basics.years,
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
									level: skill.level,
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
									position: exp.position,
									company: exp.company,
									location: exp.location,
									date: exp.date,
									summary: exp.summary,
									picture: exp.picture,
									url: exp.url,
									technologies: exp.technologies,
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
									location: edu.location,
									studyType: edu.studyType,
									date: edu.date,
									summary: edu.summary,
									logo: edu.logo,
									url: edu.url,
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
									date: proj.date,
									technologies: proj.technologies,
									website: proj.website,
									source: proj.source,
									image: proj.image,
									video: proj.video,
									type: proj.type,
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
									summary: cert.summary,
									url: cert.url,
									visible: cert.visible,
								})),
							}
						: undefined,
				// Update socials if provided
				socials:
					socials?.items?.length > 0
						? {
								deleteMany: {},
								create: socials.items.map((prof) => ({
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
									location: hack.location,
									description: hack.description,
									date: hack.date,
									logo: hack.logo,
									url: hack.url,
									links:
										hack?.links?.length > 0
											? {
													deleteMany: {},
													create: hack.links.map(
														({ id, ...link }) => ({
															...link,
															// Exclude the id field when creating new links
														})
													),
												}
											: undefined,
									visible: hack.visible,
								})),
							}
						: undefined,
			},
			select: portfolioSelect,
		});

		if (!updatedPortfolio) {
			throw new Error("Portfolio not found");
		}

		return transformPortfolio(updatedPortfolio);
	});
}

export async function createPortfolioWithSections(data) {
	return withErrorHandling(async () => {
		const userId = await verifyAuth();

		// Extract main portfolio fields and nested sections
		const {
			id: portfolioId,
			basics,
			skills,
			experiences,
			educations,
			projects,
			certifications,
			socials,
			hackathons,
			...portfolioData
		} = data;

		// Create portfolio with all nested data in a single transaction
		return await prisma.$transaction(async (tx) => {
			// Create the portfolio first
			const newPortfolio = await tx.portfolio.create({
				data: {
					...portfolioData,
					user: { connect: { id: userId } },
				},
				select: { id: true },
			});

			// Handle basics section if provided
			if (basics) {
				await tx.basics.create({
					data: {
						portfolioId: newPortfolio.id,
						name: basics.name,
						headline: basics.headline,
						email: basics.email,
						phone: basics.phone,
						location: basics.location,
						years: basics.years,
						url: basics.url,
						picture: basics.picture,
						summary: basics.summary,
						about: basics.about,
					},
				});
			}

			// Create section items using helper functions
			if (skills?.items?.length > 0) {
				await createSkills(tx, newPortfolio.id, skills.items);
			}

			if (experiences?.items?.length > 0) {
				await createExperiences(tx, newPortfolio.id, experiences.items);
			}

			if (educations?.items?.length > 0) {
				await createEducations(tx, newPortfolio.id, educations.items);
			}

			if (projects?.items?.length > 0) {
				await createProjects(tx, newPortfolio.id, projects.items);
			}

			if (certifications?.items?.length > 0) {
				await createCertifications(
					tx,
					newPortfolio.id,
					certifications.items
				);
			}

			if (socials?.items?.length > 0) {
				await createSocials(tx, newPortfolio.id, socials.items);
			}

			if (hackathons?.items?.length > 0) {
				await createHackathons(tx, newPortfolio.id, hackathons.items);
			}

			// Fetch complete portfolio with all relations
			const completePortfolio = await tx.portfolio.findUnique({
				where: { id: newPortfolio.id },
				select: portfolioSelect,
			});

			return transformPortfolio(completePortfolio);
		});
	});
}

// Helper functions for creating section items
async function createSkills(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.skill.create({
				data: {
					portfolioId,
					name: item.name,
					description: item.description,
					level: item.level,
					visible: item.visible ?? true,
				},
			})
		)
	);
}

async function createExperiences(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.experience.create({
				data: {
					portfolioId,
					position: item.position,
					company: item.company,
					location: item.location,
					date: item.date,
					summary: item.summary,
					picture: item.picture,
					url: item.url,
					technologies: item.technologies,
					visible: item.visible ?? true,
				},
			})
		)
	);
}

async function createEducations(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.education.create({
				data: {
					portfolioId,
					institution: item.institution,
					location: item.location,
					studyType: item.studyType,
					date: item.date,
					summary: item.summary,
					logo: item.logo,
					url: item.url,
					visible: item.visible ?? true,
				},
			})
		)
	);
}

async function createProjects(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.project.create({
				data: {
					portfolioId,
					name: item.name,
					description: item.description,
					date: item.date,
					technologies: item.technologies,
					website: item.website,
					source: item.source,
					image: item.image,
					video: item.video,
					type: item.type,
					visible: item.visible ?? true,
				},
			})
		)
	);
}

async function createCertifications(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.certification.create({
				data: {
					portfolioId,
					name: item.name,
					issuer: item.issuer,
					date: item.date,
					summary: item.summary,
					url: item.url,
					visible: item.visible ?? true,
				},
			})
		)
	);
}

async function createSocials(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.social.create({
				data: {
					portfolioId,
					network: item.network,
					username: item.username,
					url: item.url,
					visible: item.visible ?? true,
				},
			})
		)
	);
}

async function createHackathons(tx, portfolioId, items) {
	await Promise.all(
		items.map((item) =>
			tx.hackathon.create({
				data: {
					portfolioId,
					name: item.name,
					location: item.location,
					description: item.description,
					date: item.date,
					logo: item.logo,
					url: item.url,
					visible: item.visible ?? true,
					links: {
						create: (item.links || []).map((link) => ({
							label: link.label,
							url: link.url,
							icon: link.icon,
						})),
					},
				},
			})
		)
	);
}

// Custom error classes for better error handling
class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.name = "UnauthorizedError";
		this.statusCode = 401;
	}
}
