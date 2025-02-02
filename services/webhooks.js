import { handlePaymentSuccess } from "./subscription";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/utils";

export async function handleChargeWebhook(data) {
	const { tx_ref, status, customer } = data;
	logger.info(`Processing charge webhook for transaction ${tx_ref}`, {
		status,
		customer,
	});

	try {
		logger.info(`Finding transaction ${tx_ref}`);
		// Find the transaction and associated subscription
		const transaction = await prisma.transaction.findUnique({
			where: { id: tx_ref },
			include: {
				subscription: true,
				user: true,
				subscriptionId: true,
			},
		});

		if (!transaction) {
			logger.error(`Transaction ${tx_ref} not found`);
			throw new Error(`Transaction ${tx_ref} not found`);
		}

		if (status === "successful") {
			logger.info(`Starting successful payment flow for ${tx_ref}`);
			// Use a transaction to update all related records
			await prisma.$transaction(async (prisma) => {
				logger.info(`Updating transaction status to completed`);
				// Update transaction status
				await prisma.transaction.update({
					where: { id: tx_ref },
					data: { status: "completed" },
				});

				// Update subscription status
				if (transaction.subscriptionId) {
					logger.info(
						`Updating subscription ${transaction.subscriptionId}`
					);
					await prisma.subscription.update({
						where: { id: transaction.subscriptionId },
						data: {
							status: "active",
							startDate: new Date(),
							endDate: getSubscriptionEndDate(
								data.meta.frequency
							),
							updatedAt: new Date(),
						},
					});

					logger.info(`Updating subscription plan status`);
					// Update subscription plan status
					await prisma.subscriptionPlan.update({
						where: { id: transaction.subscription.planId },
						data: { isActive: true },
					});
				}

				logger.info(
					`Updating user ${transaction.userId} subscription status`
				);
				// Update user subscription status
				await prisma.user.update({
					where: { id: transaction.userId },
					data: {
						subscribed: true,
						userType: data.meta.type,
					},
				});
			});

			logger.info(
				`Payment successful and subscription activated for transaction ${tx_ref}`
			);
		} else {
			logger.warn(`Starting failed payment flow for ${tx_ref}`);
			// Handle failed payment
			await prisma.$transaction(async (prisma) => {
				// Update transaction status
				await prisma.transaction.update({
					where: { id: tx_ref },
					data: { status: "failed" },
				});

				// Cancel subscription if it exists
				if (transaction.subscriptionId) {
					await prisma.subscription.update({
						where: { id: transaction.subscriptionId },
						data: {
							status: "cancelled",
							updatedAt: new Date(),
						},
					});
				}
			});

			logger.warn(`Payment failed for transaction ${tx_ref}`);
		}
	} catch (error) {
		logger.error(`Webhook processing error for ${tx_ref}:`, error);
		throw error;
	}
}

function getSubscriptionEndDate(frequency) {
	const now = new Date();
	switch (frequency.toLowerCase()) {
		case "weekly":
			return new Date(now.setDate(now.getDate() + 7));
		case "monthly":
			return new Date(now.setMonth(now.getMonth() + 1));
		case "yearly":
			return new Date(now.setFullYear(now.getFullYear() + 1));
		default:
			return new Date(now.setMonth(now.getMonth() + 1)); // Default to monthly
	}
}

export async function handleSubscriptionCancelled(data) {
	const { customer, plan } = data;

	try {
		// Find subscription by customer email
		const subscription = await prisma.subscription.findFirst({
			where: {
				user: {
					email: customer.email,
				},
				status: "active",
			},
		});

		if (!subscription) {
			logger.warn(`No active subscription found for ${customer.email}`);
			return;
		}

		// Update subscription status
		await prisma.subscription.update({
			where: { id: subscription.id },
			data: {
				status: "cancelled",
				endDate: new Date(),
				updatedAt: new Date(),
			},
		});

		logger.info(`Subscription cancelled for ${customer.email}`);
	} catch (error) {
		logger.error("Error handling subscription cancellation:", error);
		throw error;
	}
}
