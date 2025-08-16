import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { google } from "better-auth/social-providers";
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

export const auth = betterAuth({
	trustedOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
	allowedDevOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
	cookieCache: {
		enabled: true,
		maxAge: 5 * 60, // Cache duration in seconds
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
	},
	user: {
		changeEmail: {
			enabled: true,
			// sendChangeEmailVerification: async (
			// 	{ user, newEmail, url, token },
			// 	request
			// ) => {
			// 	await sendEmail({
			// 		to: user.email, // verification email must be sent to the current user email to approve the change
			// 		subject: "Approve email change",
			// 		text: `Click the link to approve the change: ${url}`,
			// 	});
			// },
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
