"use server";

import { prisma } from "@/lib/db"; // Assume this is your database connection
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";
import { userSchema } from "@/schema/user";

const userSelect = {
	id: true,
	email: true,
	subscribed: true,
	userType: true,
	createdAt: true,
	updatedAt: true,
	subscription: {
		select: {
			id: true,
			type: true,
			frequency: true,
			status: true,
			priceId: true,
			startDate: true,
			endDate: true,
		},
	},
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

export async function getUsers() {
	return withErrorHandling(async () => {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				subscribed: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		return users.map((user) => userSchema.parse(user));
	});
}

export async function getUser(userId) {
	return withErrorHandling(async () => {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: userSelect,
		});
		return userSchema.parse(user);
	});
}

export async function createUser(userId, email) {
	return withErrorHandling(async () => {
		const user = await prisma.user.create({
			data: {
				id: userId,
				email,
			},
		});
		return userSchema.parse(user);
	});
}

export async function updateUser(data) {
	return withErrorHandling(async () => {
		if (!data.id) {
			throw new Error("Unauthorized");
		}

		// Update user in database
		const updatedUser = await prisma.user.update({
			where: { id: data.id },
			data: {
				...data,
				updatedAt: new Date(),
			},
			select: userSelect,
		});

		revalidatePath("/builder");
		return userSchema.parse(updatedUser);
	});
}

export async function upsertUser({ id, email }) {
	return withErrorHandling(async () => {
		const user = await prisma.user.upsert({
			where: { email },
			update: { id },
			create: { id, email },
			select: userSelect,
		});
		return userSchema.parse(user);
	});
}

export async function deleteUser(userId) {
	return withErrorHandling(async () => {
		const user = await prisma.user.delete({
			data: {
				id: userId,
			},
		});
		return { userId };
	});
}
