"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { hackathonSchema } from "@/schema/sections";
import { logger } from "@/lib/utils";

const select = {
	id: true,
	name: true,
	description: true,
	date: true,
	location: true,
	visible: true,
	url: true,
	logo: true,
	portfolioId: true,
	links: {
		select: {
			id: true,
			label: true,
			url: true,
			icon: true,
		},
	},
};

export async function getHackathons(portfolioId) {
	return withErrorHandling(async () => {
		const hackathons = await prisma.hackathon.findMany({
			where: { portfolioId },
			select,
		});
		if (hackathons.length > 0) {
			return hackathons.map((item) => hackathonSchema.parse(item));
		}
		return [];
	});
}

export async function createHackathon({ portfolioId, ...data }) {
	logger.info("createHackathon called with data:", data);

	// Validate input data
	if (data === null || data === undefined) {
		logger.error("createHackathon received null or undefined data");
		throw new Error("No hackathon data provided");
	}

	return withErrorHandling(async () => {
		// Defensive checks
		if (!data) {
			logger.error("Data is falsy inside withErrorHandling");
			throw new Error("Invalid hackathon data");
		}

		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			logger.error("No authenticated user found");
			throw new Error("Unauthorized");
		}

		// Ensure links is an array
		const links = Array.isArray(data.links) ? data.links : [];

		// Create a safe copy of data
		const safeHackathonData = {
			id: data.id,
			name: data.name,
			description: data.description,
			date: data.date,
			location: data.location,
			visible: data.visible ?? true,
			url: data.url || null,
			logo: data.logo || null,
		};

		// Create hackathon with additional metadata
		const hackathon = await prisma.hackathon.create({
			data: {
				...safeHackathonData,
				portfolio: { connect: { id: portfolioId } },
				links: {
					create: links.map((link) => ({
						id: link.id || undefined,
						label: link.label,
						url: link.url,
						icon: link.icon || null,
					})),
				},
			},
			select,
		});

		logger.info("Created hackathon:", hackathon);

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return hackathonSchema.parse(hackathon);
	});
}

export async function editHackathon(hackathonId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Destructure links from the data and validate them
		const { links, ...hackathonData } = data;

		const updatedHackathon = await prisma.hackathon.update({
			where: { id: hackathonId, portfolioId },
			data: {
				...hackathonData,
				updatedAt: new Date(),
				links: {
					upsert: links.map((link) => ({
						where: { id: link.id || "" },
						create: {
							label: link.label,
							url: link.url,
							icon: link.icon || null,
						},
						update: {
							label: link.label,
							url: link.url,
							icon: link.icon || null,
						},
					})),
					deleteMany: {
						id: { notIn: links.map((link) => link.id) },
					},
				},
			},
			select,
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return hackathonSchema.parse(updatedHackathon);
	});
}

export async function deleteHackathon(hackathonId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a hackathon"
			);
		}

		await prisma.hackathon.delete({
			where: { id: hackathonId, portfolioId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return { hackathonId, portfolioId };
	});
}
