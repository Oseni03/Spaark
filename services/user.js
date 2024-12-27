"use server";

import { basicsSchema } from "@/schema/basics";
import { prisma } from "@/lib/db"; // Assume this is your database connection
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { defaultBasics } from "@/schema/basics";
import { withErrorHandling } from "./shared";
import { PrismaClient } from "@prisma/client";

export async function getUserByUsername(username) {
	return withErrorHandling(async () => {
		// Fetch the userId based on the username
		const user = await prisma.user.findUnique({
			where: { username },
			select: {
				id: true,
				username: true,
				basics: true,
				subscribed: true,
				createdAt: true,
			},
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
		// Fetch the userId based on the username
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				username: true,
				subscribed: true,
				createdAt: true,
				updatedAt: true,
			},
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
				basics: {
					create: defaultBasics,
				},
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

export async function createUserBasics(userId, data = defaultBasics) {
	return withErrorHandling(async () => {
		if (!userId) {
			throw new Error("User ID is required");
		}
		const userExists = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userExists) {
			throw new Error("User does not exist");
		}
		// Create User with Basics
		// Upsert basics with provided or default data
		const basics = await prisma.basics.upsert({
			where: { userId },
			update: {
				...data,
				userId,
			},
			create: {
				...data,
				userId,
			},
		});
		return basics;
	});
}

// Update user basics server action
export async function updateUserBasics(data) {
	return withErrorHandling(async () => {
		// Get the authenticated user
		const { userId } = await auth();
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Update user in database
		const updatedBasics = await prisma.basics.update({
			where: { userId },
			data: {
				...data,
				updatedAt: new Date(), // Ensure updated timestamp is set
			},
		});

		// Revalidate the path to update cached data
		revalidatePath("/builder");

		return updatedBasics;
	});
}

// Fetch user basics server action
export async function getUserBasics(userId) {
	return withErrorHandling(async () => {
		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Fetch user from database
		const userData = await prisma.basics.findUnique({
			where: { userId },
			select: {
				name: true,
				headline: true,
				email: true,
				phone: true,
				location: true,
				url: true,
				picture: true,
				summary: true,
				about: true,
			},
		});

		if (!userData) {
			throw new Error("User not found");
		}

		// Validate the fetched data against the schema
		return basicsSchema.parse(userData);
	});
}
