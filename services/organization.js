import { prisma } from "@/lib/db";
import { logger } from "@/lib/utils";
import { withErrorHandling } from "./shared";

export async function createOrganization(orgData, ownerId) {
	return withErrorHandling(async () => {
		const organization = await prisma.organization.create({
			data: {
				id: orgData.id,
				name: orgData.name,
				slug: orgData.slug,
				logo: orgData.logo_url,
				ownerId,
				members: {
					create: {
						userId: ownerId,
						organizationId: orgData.id,
						role: "OWNER",
						status: "active",
						joinedAt: new Date(),
						permissions: [
							"MANAGE_ORGANIZATION",
							"MANAGE_MEMBERS",
							"INVITE_MEMBERS",
							"MANAGE_ROLES",
						],
					},
				},
			},
		});

		logger.info(`Organization created: ${organization.id}`);
		return organization;
	});
}

export async function deleteOrganization(orgId) {
	return withErrorHandling(async () => {
		const deleted = await prisma.organization.delete({
			where: { id: orgId },
		});

		logger.info(`Organization deleted: ${orgId}`);
		return deleted;
	});
}

export async function updateOrganization(orgData) {
	return withErrorHandling(async () => {
		const organization = await prisma.organization.update({
			where: { id: orgData.id },
			data: {
				name: orgData.name,
				slug: orgData.slug,
				logo: orgData.logo_url,
				updatedAt: new Date(),
			},
		});

		logger.info(`Organization updated: ${organization.id}`);
		return organization;
	});
}
