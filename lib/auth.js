import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
// import { google } from "better-auth/providers";
import { prisma } from "./db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6,
		autoSignIn: true,
		requireEmailVerification: false,
		revokeSessionsOnPasswordReset: true,
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	// providers: [
	// 	GOOGLE_CLIENT_ID &&
	// 		google({
	// 			clientId: GOOGLE_CLIENT_ID,
	// 			clientSecret: GOOGLE_CLIENT_SECRET,
	// 			redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
	// 		}),
	// ],
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
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
	plugins: [nextCookies()],
});
