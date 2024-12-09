"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { projectSchema } from "@/schema/sections";

export async function getUserProjects(userId) {
	return withErrorHandling(async () => {
		const projects = await prisma.project.findMany({
			where: { userId },
			select: {
				id: true,
				visible: true,
				name: true,
				description: true,
				date: true,
				keywords: true,
				url: true,
				source: true,
			},
		});
		if (projects.length > 0) {
			return projects.map((item) => projectSchema.parse(item));
		}
		return [];
	});
}

export async function createProject(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create project with additional metadata
		const project = await prisma.project.create({
			data: {
				...data,
				userId,
			},
		});

		// Revalidate multiple potential paths
		revalidatePath("/builder");
		return project;
	});
}

export async function editProject(projectId, data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const existingProject = await prisma.project.findUnique({
			where: { id: projectId, userId },
		});

		if (!existingProject) {
			throw new Error(
				"Project not found or you do not have permission to update"
			);
		}

		const updatedProject = await prisma.project.update({
			where: { id: projectId },
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return updatedProject;
	});
}

export async function deleteProject(projectId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error(
				"Unauthorized: Must be logged in to delete a project"
			);
		}

		const existingProject = await prisma.project.findUnique({
			where: { id: projectId, userId },
		});

		if (!existingProject) {
			throw new Error(
				"Project not found or you do not have permission to delete"
			);
		}

		const deletedProject = await prisma.project.delete({
			where: { id: projectId },
		});

		// Revalidate relevant paths
		revalidatePath("/builder");

		return deletedProject;
	});
}
