"use server";

import { prisma } from "@/lib/db"; // Assume this is your database connection
import { withErrorHandling } from "./shared";
import { userSchema } from "@/schema/user";
import { getUserFromSession, verifyAuth } from "@/lib/auth-utils";
import { auth } from "@/lib/auth";

const userSelect = {
	id: true,
	email: true,
	subscribed: true,
	userType: true,
	createdAt: true,
	updatedAt: true,
	subscription: true,
};

export async function getUserByEmail(email) {
	return withErrorHandling(async () => {
		const user = await prisma.user.findUnique({
			where: { email },
			select: userSelect,
		});
		return userSchema.parse(user);
	});
}

export const signIn = async (email, password) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		return {
			success: true,
			message: "Signed in successfully.",
		};
	} catch (error) {
		return {
			success: false,
			message: error.message || "An unknown error occurred.",
		};
	}
};

export const signUp = async (email, password, username) => {
	try {
		await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: username,
			},
		});

		return {
			success: true,
			message: "Signed up successfully.",
		};
	} catch (error) {
		return {
			success: false,
			message: error.message || "An unknown error occurred.",
		};
	}
};
