"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { projectSchema } from "@/schema/sections";

export async function getProjects(portfolioId) {
	return withErrorHandling(async () => {
		const projects = await prisma.project.findMany({
			where: { portfolioId },
			select: {
				id: true,
				visible: true,
				name: true,
				description: true,
				date: true,
				technologies: true,
				url: true,
				image: true,
				video: true,
				links: {
					select: { id: true, label: true, url: true, icon: true },
				},
				portfolioId: true,
				// Exclude createdAt and updatedAt
			},
		});
		if (projects.length > 0) {
			return projects.map((item) => projectSchema.parse(item));
		}
		return [];
	});
}

export async function createProject({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Destructure links from the data and exclude it from the project data
		const { links, ...projectData } = data;

		// Create the project with nested links
		const project = await prisma.project.create({
			data: {
				...projectData,
				portfolio: { connect: { id: portfolioId } },
				links: {
					create: links.map((link) => ({
						id: link.id,
						label: link.label,
						url: link.url,
						icon: link.icon || null,
					})),
				},
			},
			select: {
				id: true,
				visible: true,
				name: true,
				description: true,
				date: true,
				technologies: true,
				url: true,
				image: true,
				video: true,
				links: {
					select: { id: true, label: true, url: true, icon: true },
				},
				portfolioId: true,
				// Exclude createdAt and updatedAt
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return project;
	});
}

export async function editProject(projectId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Destructure links from the data and validate them
		const { links, ...projectData } = data;

		// Perform the update, including nested operations for links
		const updatedProject = await prisma.project.update({
			where: { id: projectId, portfolioId },
			data: {
				...projectData,
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
			select: {
				id: true,
				visible: true,
				name: true,
				description: true,
				date: true,
				technologies: true,
				url: true,
				image: true,
				video: true,
				links: {
					select: { id: true, label: true, url: true, icon: true },
				},
				portfolioId: true,
				// Exclude createdAt and updatedAt
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedProject;
	});
}

export async function deleteProject(projectId, portfolioId) {
	return withErrorHandling(async () => {
		// Authenticate user
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error(
				"Unauthorized: You must be logged in to delete a project."
			);
		}

		// Delete the project and its associated links
		await prisma.project.delete({
			where: { id: projectId, portfolioId },
		});

		// Revalidate relevant paths to reflect changes
		revalidatePath("/builder");

		return { projectId, portfolioId };
	});
}
