"use server";

import { withErrorHandling } from "./shared";
import { prisma } from "@/lib/db";

export async function activateUserCode(userCode, userId) {
	return withErrorHandling(async () => {
		// Fetch the userId based on the username
		const code = await prisma.code.update({
			where: {
				code: userCode,
				isActive: true,
			},
			data: {
				isActive: false,
				userId,
				updatedAt: new Date(), // Ensure updated timestamp is set
			},
		});

		const user = await prisma.user.update({
			where: { id: userId },
			data: {
				codeId: code.id,
				subscribed: true,
				updatedAt: new Date(), // Ensure updated timestamp is set
			},
		});
		return code;
	});
}
