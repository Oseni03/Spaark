"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { teamSchema } from "@/schema/sections";
import { COOKIE_NAME } from "@/utils/constants";

const teamSelect = {
	id: true,
	visible: true,
	name: true,
	role: true,
	bio: true,
	avatar: true,
	links: {
		select: { id: true, label: true, url: true, icon: true },
	},
	portfolioId: true,
};

export async function getTeamMembers(portfolioId) {
	return withErrorHandling(async () => {
		const members = await prisma.team.findMany({
			where: { portfolioId },
			select: teamSelect,
		});
		return members.map((item) => teamSchema.parse(item));
	});
}

export async function createTeamMember({ portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Destructure links from the data and exclude it from the team member data
		const { links, ...teamData } = data;

		// Create the team member with nested links
		const member = await prisma.team.create({
			data: {
				...teamData,
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
			select: teamSelect,
		});

		revalidatePath("/builder");
		return teamSchema.parse(member);
	});
}

export async function editTeamMember(teamId, { portfolioId, ...data }) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		// Destructure links from the data and validate them
		const { links, ...teamData } = data;

		// Perform the update, including nested operations for links
		const updatedMember = await prisma.team.update({
			where: { id: teamId, portfolioId },
			data: {
				...teamData,
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
			select: teamSelect,
		});

		revalidatePath("/builder");
		return teamSchema.parse(updatedMember);
	});
}

export async function deleteTeamMember(teamId, portfolioId) {
	return withErrorHandling(async () => {
		const cookieStore = await cookies();
		const authToken = cookieStore.get(COOKIE_NAME)?.value;
		const decodedToken = await verifyAuthToken(authToken);
		if (!decodedToken?.uid || !portfolioId) {
			throw new Error("Unauthorized");
		}

		await prisma.team.delete({
			where: { id: teamId, portfolioId },
		});

		revalidatePath("/builder");
		return { teamId, portfolioId };
	});
}
