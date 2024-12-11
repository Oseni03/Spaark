"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { hackathonSchema } from "@/schema/sections";

export async function getUserHackathons(userId) {
	return withErrorHandling(async () => {
		const hackathons = await prisma.hackathon.findMany({
			where: { userId },
			include: {
				links: {
					select: { id: true, label: true, url: true, icon: true },
				},
			},
		});
		if (hackathons.length > 0) {
			return hackathons.map((item) => hackathonSchema.parse(item));
		}
		return [];
	});
}

export async function createHackathon(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const { links, ...hackathonData } = data;
		console.log("Links: ", links);
		console.log("Hackathon data: ", hackathonData);

		// Create hackathon with additional metadata
		const hackathon = await prisma.hackathon.create({
			data: {
				...hackathonData,
				userId,
				links: {
					create: links.map((link) => ({
						id: link.id,
						label: link.label,
						url: link.url,
						icon: link.icon || null,
					})),
				},
			},
		});
		console.log("Created hackathon: ", hackathon);

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return hackathon;
	});
}

export async function editHackathon(hackathonId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingHackathon = await prisma.hackathon.findUnique({
			where: { id: hackathonId, userId },
		});

		if (!existingHackathon) {
			throw new Error(
				"Hackathon not found or you do not have permission to update"
			);
		}

		// Destructure links from the data and validate them
		const { links, ...hackathonData } = data;

		const updatedHackathon = await prisma.hackathon.update({
			where: { id: hackathonId },
			data: {
				...hackathonData,
				updatedAt: new Date(),
				links: {
					// Handle nested updates for links
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
					// Remove links not included in the updated data
					deleteMany: {
						id: { notIn: links.map((link) => link.id) },
					},
				},
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedHackathon;
	});
}

export async function deleteHackathon(hackathonId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a hackathon"
			);
		}

		const existingHackathon = await prisma.hackathon.findUnique({
			where: { id: hackathonId, userId },
		});

		if (!existingHackathon) {
			throw new Error(
				"Hackathon not found or you do not have permission to delete"
			);
		}

		const deletedHackathon = await prisma.hackathon.delete({
			where: { id: hackathonId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedHackathon;
	});
}
