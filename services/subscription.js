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
	return withErrorHandling(async () => {
		if (!userId || !type || !frequency || !priceId) {
			throw new Error(
				"Missing required fields for subscription initialization"
			);
		}

		const getEndDate = (frequency) => {
			const now = Date.now();
			switch (frequency.toUpperCase()) {
				case "WEEKLY":
					return new Date(now + 7 * 24 * 60 * 60 * 1000); // 7 days
				case "MONTHLY":
					return new Date(now + 30 * 24 * 60 * 60 * 1000); // 30 days
				case "YEARLY":
					return new Date(now + 365 * 24 * 60 * 60 * 1000); // 365 days
				default:
					throw new Error(`Invalid frequency: ${frequency}`);
			}
		};

		const subscription = await prisma.subscription.upsert({
			where: { userId },
			update: {
				organizationId: orgId || null,
				status: "pending",
				portfolioLimit,
				type,
				frequency,
				priceId,
				startDate: new Date(),
				endDate: getEndDate(frequency),
			},
			create: {
				userId,
				organizationId: orgId || null,
				status: "pending",
				portfolioLimit,
				type,
				frequency,
				priceId,
				startDate: new Date(),
				endDate: getEndDate(frequency),
			},
		});

		if (!subscription) {
			throw new Error("Failed to create subscription record");
		}

		return subscription;
	});
}

export async function createTransaction({
	userId,
	orgId,
	title,
	subscriptionId,
	amount,
	priceId,
}) {
	return withErrorHandling(async () => {
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

		if (!transaction) {
			throw new Error("Failed to create transaction record");
		}

		logger.info("Transaction created successfully", {
			transactionId: transaction.id,
		});
		return transaction;
	});
}

export async function handlePaymentFailure({ transactionId }) {
	return withErrorHandling(async () => {
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

		if (!result) {
			throw new Error("Failed process failed payment");
		}

		logger.info("Failed payment processed successfully", {
			transactionId: result.id,
		});
		return result;
	});
}

export async function handlePaymentSuccess({ transactionId }) {
	return withErrorHandling(async () => {
		logger.info("Processing successful payment", { transactionId });

		const result = await prisma.$transaction(async (prisma) => {
			const updatedTransaction = await prisma.transaction.update({
				where: { id: transactionId, status: { not: "cancelled" } },
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
