import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import {
	checkout,
	polar,
	portal,
	usage,
	webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { createFreeSubscription } from "@/services/subscription";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import ConfirmEmailChange from "@/components/emails/confirm-email-change";

// Helper function to safely parse dates
function safeParseDate(dateString) {
	if (!dateString) return null;
	try {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date;
	} catch {
		return null;
	}
}

export const polarClient = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN,
	server: "sandbox",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			resend.emails.send({
				from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
				to: user.email,
				subject: "Verify your email",
				react: VerifyEmail({ username: user.name, verifyUrl: url }),
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
	},
	trustedOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
	allowedDevOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
	cookieCache: {
		enabled: true,
		maxAge: 5 * 60, // Cache duration in seconds
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		sendResetPassword: async ({ user, url }) => {
			resend.emails.send({
				from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
				to: user.email,
				subject: "Reset your password",
				react: ForgotPasswordEmail({
					username: user.name,
					resetUrl: url,
					userEmail: user.email,
				}),
			});
		},
		requireEmailVerification: true,
		// revokeSessionsOnPasswordReset: true,
	},
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async (
				{ user, newEmail, url },
				request
			) => {
				resend.emails.send({
					from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
					to: newEmail,
					subject: "Approve email change",
					react: ConfirmEmailChange({
						username: user.name,
						confirmUrl: url,
						userEmail: user.email,
						newEmail: newEmail,
					}),
				});
			},
		},
		deleteUser: {
			enabled: true,
		},
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
		},
	},
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 7 * 24 * 60 * 60, // 7 days
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
			}
			return session;
		},
	},
	databaseHooks: {
		user: {
			create: {
				// Automatically subscribe new users to the FREE plan after registration
				after: async (user, context) => {
					try {
						await createFreeSubscription(user.id);
					} catch (err) {
						console.error(
							"Failed to create free subscription for new user:",
							err
						);
					}
				},
			},
		},
	},
	plugins: [
		nextCookies(),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [
						{
							productId:
								SUBSCRIPTION_PLANS.FREE.monthly.priceId ||
								(() => {
									throw new Error(
										"POLAR PRODUCTS environment variable is required"
									);
								})(),
							slug:
								SUBSCRIPTION_PLANS.FREE.monthly.slug ||
								(() => {
									throw new Error(
										"POLAR PRODUCTS environment variable is required"
									);
								})(),
						},
						{
							productId:
								SUBSCRIPTION_PLANS.BASIC.monthly.priceId ||
								(() => {
									throw new Error(
										"POLAR PRODUCTS environment variable is required"
									);
								})(),
							slug:
								SUBSCRIPTION_PLANS.BASIC.monthly.slug ||
								(() => {
									throw new Error(
										"POLAR PRODUCTS environment variable is required"
									);
								})(),
						},
						{
							productId:
								SUBSCRIPTION_PLANS.PRO.monthly.priceId ||
								(() => {
									throw new Error(
										"POLAR PRODUCTS environment variable is required"
									);
								})(),
							slug:
								SUBSCRIPTION_PLANS.PRO.monthly.slug ||
								(() => {
									throw new Error(
										"POLAR PRODUCTS environment variable is required"
									);
								})(),
						},
					],
					successUrl: "/success?checkout_id={CHECKOUT_ID}",
					authenticatedUsersOnly: true,
				}),
				portal(),
				usage(),
				webhooks({
					secret:
						process.env.POLAR_WEBHOOK_SECRET ||
						(() => {
							throw new Error(
								"POLAR_WEBHOOK_SECRET environment variable is required"
							);
						})(),
					onPayload: async ({ data, type }) => {
						if (
							type === "subscription.created" ||
							type === "subscription.active" ||
							type === "subscription.canceled" ||
							type === "subscription.revoked" ||
							type === "subscription.uncanceled" ||
							type === "subscription.updated"
						) {
							console.log(
								"🎯 Processing subscription webhook:",
								type
							);
							console.log(
								"📦 Payload data:",
								JSON.stringify(data, null, 2)
							);

							try {
								// STEP 1: Extract user ID from customer data
								const userId = data.customer?.externalId;
								// STEP 2: Build subscription data
								const subscriptionData = {
									// id: data.id,
									createdAt: new Date(data.createdAt),
									updatedAt:
										safeParseDate(data.modifiedAt) ||
										new Date(),
									amount: data.amount,
									currency: data.currency,
									recurringInterval: data.recurringInterval,
									status: data.status,
									currentPeriodStart:
										safeParseDate(
											data.currentPeriodStart
										) || new Date(),
									currentPeriodEnd:
										safeParseDate(data.currentPeriodEnd) ||
										new Date(),
									cancelAtPeriodEnd:
										data.cancelAtPeriodEnd || false,
									canceledAt: safeParseDate(data.canceledAt),
									startedAt:
										safeParseDate(data.startedAt) ||
										new Date(),
									endsAt: safeParseDate(data.endsAt),
									endedAt: safeParseDate(data.endedAt),
									customerId: data.customerId,
									productId: data.productId,
									discountId: data.discountId || null,
									checkoutId: data.checkoutId || "",
									customerCancellationReason:
										data.customerCancellationReason || null,
									customerCancellationComment:
										data.customerCancellationComment ||
										null,
									metadata: data.metadata
										? JSON.stringify(data.metadata)
										: null,
									customFieldData: data.customFieldData
										? JSON.stringify(data.customFieldData)
										: null,
									userId: userId,
								};

								console.log("💾 Final subscription data:", {
									id: data.id,
									status: subscriptionData.status,
									userId: subscriptionData.userId,
									amount: subscriptionData.amount,
								});

								// STEP 3: Use Prisma's upsert for proper upsert
								await prisma.subscription.upsert({
									where: { id: data.id },
									update: { ...subscriptionData },
									create: {
										id: data.id,
										...subscriptionData,
									},
								});

								// Automatically subscribe user to FREE plan on cancellation
								if (
									type === "subscription.canceled" &&
									userId
								) {
									await createFreeSubscription(userId);
								}

								console.log(
									"✅ Upserted subscription:",
									data.id
								);
							} catch (error) {
								console.error(
									"💥 Error processing subscription webhook:",
									error
								);
								// Don't throw - let webhook succeed to avoid retries
							}
						}
					},
				}),
			],
		}),
	],
});
