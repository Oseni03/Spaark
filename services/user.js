"use server";

import { prisma } from "@/lib/db"; // Assume this is your database connection
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "./shared";

const userSelect = {
	id: true,
	username: true,
	email: true,
	subscribed: true,
	basics: true,
	createdAt: true,
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

export async function getUserByUsername(username) {
	return withErrorHandling(async () => {
		const user = await prisma.user.findUnique({
			where: { username },
			select: userSelect,
		});
		return user;
	});
}

export async function getUserByEmail(email) {
	return withErrorHandling(async () => {
		const user = await prisma.user.findUnique({
			where: { email },
			select: userSelect,
		});
		return user;
	});
}

export async function getUsers() {
	return withErrorHandling(async () => {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				username: true,
				subscribed: true,
				createdAt: true,
				updatedAt: true,
			},
			where: {
				username: {
					not: null,
				},
			},
		});
		return users;
	});
}

export async function getUser(userId) {
	return withErrorHandling(async () => {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: userSelect,
		});
		return user;
	});
}

export async function createUser(userId, username, email) {
	return withErrorHandling(async () => {
		const user = await prisma.user.create({
			data: {
				id: userId,
				username,
				email,
			},
		});
		return user;
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
				updatedAt: new Date(), // Ensure updated timestamp is set
			},
		});

		// Revalidate the path to update cached data
		revalidatePath("/builder");

		return updatedUser;
	});
}

export async function deleteUser(userId) {
	return withErrorHandling(async () => {
		const user = await prisma.user.delete({
			data: {
				id: userId,
			},
		});
		return user;
	});
}
