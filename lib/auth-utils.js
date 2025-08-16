"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the user ID from the current session
 */
export async function getUserIdFromSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user?.id;
}

/**
 * Get the user from the current session
 */
export async function getUserFromSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
}

/**
 * Verify if the request is authenticated and get the user ID
 * @throws {Error} If user is not authenticated
 */
export async function verifyAuth() {
	const userId = await getUserIdFromSession();
	if (!userId) {
		throw new Error("Unauthorized");
	}
	return userId;
}
