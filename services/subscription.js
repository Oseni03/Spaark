import { prisma } from "@/lib/db";
import { withErrorHandling } from "./shared";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils";

export async function initializeSubscription({
	userId,
	orgId,
	portfolioLimit,
	type,
	frequency,
	priceId,
}) {
	try {
		logger.info("Initializing subscription", {
			userId,
			orgId,
			type,
			frequency,
			priceId,
		});

		if (!userId && !orgId) {
			throw new Error("UserId or OrgId has to be provided");
		}

		const subscription = await prisma.subscription.create({
			data: {
				userId: userId || null,
				organizationId: orgId || null,
				status: "pending",
				portfolioLimit,
				type,
				frequency,
				priceId,
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
	orgId,
	title,
	subscriptionId,
	amount,
	priceId,
}) {
	try {
		logger.info("Creating transaction", {
			userId,
			orgId,
			subscriptionId,
			amount,
		});

		if (!userId && !orgId) {
			throw new Error("UserId or OrgId has to be provided");
		}

		const transaction = await prisma.transaction.create({
			data: {
				userId,
				organizationId: orgId || null,
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

export async function handlePaymentFailure({ transactionId }) {
	try {
		logger.info("Processing failed payment", { transactionId });

		const result = await prisma.$transaction(async (prisma) => {
			const transaction = await prisma.transaction.update({
				where: { id: transactionId },
				data: { status: "cancelled" },
				include: { subscription: true },
			});

			if (transaction.subscription) {
				await prisma.subscription.update({
					where: { id: transaction.subscription.id },
					data: { status: "cancelled" },
				});
			}

			return transaction;
		});

		logger.info("Failed payment processed", { transactionId });
		return result;
	} catch (error) {
		logger.error("Failed to process payment failure:", error);
		throw error;
	}
}

export async function handlePaymentSuccess({ transactionId }) {
	try {
		logger.info("Processing successful payment", { transactionId });

		const transaction = await prisma.transaction.findUnique({
			where: { id: transactionId },
			include: { subscription: true },
		});

		if (!transaction) {
			throw new Error("Transaction not found");
		}

		if (transaction.status === "cancelled") {
			logger.info("Transaction already cancelled, skipping update", {
				transactionId,
			});
			return transaction;
		}

		const result = await prisma.$transaction(async (prisma) => {
			const updatedTransaction = await prisma.transaction.update({
				where: { id: transactionId },
				data: { status: "completed" },
				include: { subscription: true },
			});

			if (updatedTransaction.subscription) {
				await prisma.subscription.update({
					where: { id: updatedTransaction.subscription.id },
					data: { status: "active" },
				});
			}

			return updatedTransaction;
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
