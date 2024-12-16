import { prisma } from "@/lib/db";
import { withErrorHandling } from "./shared";
import { auth } from "@clerk/nextjs/server";

export async function createTransaction({ userId, title, priceId }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create skill with additional metadata
		const trxn = await prisma.transaction.create({
			data: {
				priceId,
				title,
				user: { connect: { id: userId } },
			},
		});

		// Revalidate multiple potential paths
		return trxn;
	});
}

export async function updateTransaction({ tx_ref, status }) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		if (!tx_ref || !status) {
			throw new Error("Missing required parameter");
		}

		// Create skill with additional metadata
		const trxn = await prisma.transaction.update({
			where: { id: tx_ref },
			data: {
				status,
				updatedAt: new Date(),
			},
			include: {
				user: {
					select: {
						id: true,
					},
				},
			},
		});

		// Revalidate multiple potential paths
		return trxn;
	});
}

export async function updateSubscription() {
	return withErrorHandling(async () => {
		const { userId } = auth();

		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Create skill with additional metadata
		const user = await prisma.user.update({
			where: { userId },
			data: {
				subscribed: true,
				updatedAt: new Date(),
			},
		});

		return user;
	});
}
