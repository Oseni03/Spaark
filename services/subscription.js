import { prisma } from "@/lib/db";
import { withErrorHandling } from "./shared";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils";

export async function initializeSubscription({
	userId,
	type,
	frequency,
	priceId,
}) {
	try {
		logger.info("Initializing subscription", { userId, type, frequency });

		const subscription = await prisma.subscription.create({
			data: {
				userId,
				status: "pending",
				planType: type,
				frequency: frequency,
				priceId: priceId,
				startDate: new Date(),
				endDate: null,
			},
		});

		logger.info("Subscription initialized successfully", {
			subscriptionId: subscription.id,
		});
		return subscription;
	} catch (error) {
		logger.error("Failed to initialize subscription:", error);
		throw error;
	}
}

export async function createTransaction({
	userId,
	title,
	subscriptionId,
	amount,
	priceId,
}) {
	try {
		logger.info("Creating transaction", { userId, subscriptionId, amount });

		const transaction = await prisma.transaction.create({
			data: {
				userId,
				title,
				status: "pending",
				amount,
				subscriptionId,
				priceId,
			},
		});

		logger.info("Transaction created successfully", {
			transactionId: transaction.id,
		});
		return {
			success: true,
			data: transaction,
		};
	} catch (error) {
		logger.error("Failed to create transaction:", error);
		throw error;
	}
}

export async function handlePaymentSuccess(transactionId) {
	try {
		logger.info("Processing successful payment", { transactionId });

		const result = await prisma.$transaction(async (prisma) => {
			const transaction = await prisma.transaction.update({
				where: { id: transactionId },
				data: { status: "completed" },
				include: { subscription: true },
			});

			if (transaction.subscription) {
				await prisma.subscription.update({
					where: { id: transaction.subscription.id },
					data: { status: "active" },
				});
			}

			return transaction;
		});

		logger.info("Payment processed successfully", { transactionId });
		return result;
	} catch (error) {
		logger.error("Failed to process payment:", error);
		throw error;
	}
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
