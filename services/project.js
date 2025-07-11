"use server";

import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-utils";
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
	type: true,
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
		await verifyAuth();

		const project = await prisma.project.create({
			data: {
				...data,
				portfolio: { connect: { id: portfolioId } },
			},
			select,
		});

		revalidatePath(`/dashboard/projects`);
		return projectSchema.parse(project);
	});
}

export async function editProject(projectId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		await verifyAuth();
		if (!portfolioId) {
			throw new Error("Portfolio ID is required");
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

export async function deleteProject(id) {
	return withErrorHandling(async () => {
		await verifyAuth();

		const project = await prisma.project.delete({
			where: { id },
			select,
		});

		revalidatePath(`/dashboard/projects`);
		return projectSchema.parse(project);
	});
}

export async function updateProject(id, data) {
	return withErrorHandling(async () => {
		await verifyAuth();
		
		const project = await prisma.project.update({
			where: { id },
			data,
			select,
		});

		revalidatePath(`/dashboard/projects`);
		return projectSchema.parse(project);
	});
}

export async function updateOrder(portfolioId, order) {
	return withErrorHandling(async () => {
		await verifyAuth();

		for (const [index, projectId] of order.entries()) {
			await prisma.project.update({
				where: { id: projectId },
				data: { order: index },
			});
		}

		revalidatePath(`/dashboard/projects`);
		return true;
	});
}
