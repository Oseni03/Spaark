import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import { checkout, polar, usage } from "@polar-sh/better-auth";
import { magicLink } from "better-auth/plugins";
import { Polar } from "@polar-sh/sdk";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { createFreeSubscription } from "@/services/subscription";
import { Resend } from "resend";
import ConfirmEmailChange from "@/components/emails/confirm-email-change";
import ConfirmAccountDelete from "@/components/emails/confirm-account-delete";

export const polarClient = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN,
	server: "sandbox",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
	trustedOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
	allowedDevOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
	cookieCache: {
		enabled: true,
		maxAge: 5 * 60, // Cache duration in seconds
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
					to: user.email, // Send to current email for approval
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
			sendDeleteAccountVerification: async ({ user, url }, request) => {
				resend.emails.send({
					from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
					to: user.email,
					subject: "Verify Account Deletion",
					react: ConfirmAccountDelete({
						username: user.name,
						confirmUrl: url,
						email: user.email,
					}),
				});
			},
			beforeDelete: async (user, request) => {
				if (user.email.includes("admin")) {
					throw new APIError("BAD_REQUEST", {
						message: "Admin accounts cannot be deleted",
					});
				}
			},
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
		magicLink({
			sendMagicLink: async ({ email, url }, request) => {
				resend.emails.send({
					from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
					to: email,
					subject: "Sign in to Spaark",
					text: `Hi there!,

                        Click the link below to securely sign in:

                        👉 ${url}

                        This link will expire in 5 minutes. If you didn’t request this, you can safely ignore this email.

                        Thanks,
                        The Spaark Team`,
				});
			},
		}),
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
				usage(),
			],
		}),
	],
});
