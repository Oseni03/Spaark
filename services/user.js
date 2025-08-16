"use server";

import { prisma } from "@/lib/db"; // Assume this is your database connection
import { withErrorHandling } from "./shared";
import { userSchema } from "@/schema/user";
import { getUserFromSession, verifyAuth } from "@/lib/auth-utils";
import { z } from "zod";
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

const UpdateProfileSchema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email().optional(),
});

const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(8),
	newPassword: z.string().min(8),
});

export async function getUserByEmail(email) {
	return withErrorHandling(async () => {
		const user = await prisma.user.findUnique({
			where: { email },
			select: userSelect,
		});
		return userSchema.parse(user);
	});
}

// Update user profile
export async function updateProfile(data) {
	try {
		const user = await getUserFromSession();

		const validatedData = UpdateProfileSchema.parse(data);
		const { name, email } = validatedData;

		// Check if email is already taken by another user
		if (email && email !== user.email) {
			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (existingUser) {
				throw createError("Email already in use", 409, "EMAIL_IN_USE");
			}
		}

		const updatedUser = await auth.api.updateUser({
			name,
			email,
		});

		return {
			success: true,
			data: { ...updatedUser },
			message: "Profile updated successfully",
		};
	} catch (error) {
		return {
			success: false,
			error: error.message || "Failed to update profile",
			code: error.code || "UPDATE_PROFILE_ERROR",
		};
	}
}
