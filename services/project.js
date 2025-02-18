"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { projectSchema } from "@/schema/sections";

const select = {
	id: true,
	visible: true,
	name: true,
	description: true,
	date: true,
	technologies: true,
	website: true,
	source: true,
	image: true,
	video: true,
	portfolioId: true,
};

export async function getProjects(portfolioId) {
	return withErrorHandling(async () => {
		const projects = await prisma.project.findMany({
			where: { portfolioId },
			select,
		});
		if (projects.length > 0) {
			return projects.map((item) => projectSchema.parse(item));
		}
		return [];
	});
}

export async function createProject({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		const project = await prisma.project.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select,
		});

		revalidatePath("/builder");
		return projectSchema.parse(project);
	});
}

export async function editProject(projectId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error("Unauthorized");
		}

		const updatedProject = await prisma.project.update({
			where: { id: projectId, portfolioId },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select,
		});

		revalidatePath("/builder");
		return projectSchema.parse(updatedProject);
	});
}

export async function deleteProject(projectId, portfolioId) {
	return withErrorHandling(async () => {
		const { userId } = await auth();
		if (!userId || !portfolioId) {
			throw new Error(
				"Unauthorized: You must be logged in to delete a project."
			);
		}

		await prisma.project.delete({
			where: { id: projectId, portfolioId },
		});

		revalidatePath("/builder");

		return { projectId, portfolioId };
	});
}
