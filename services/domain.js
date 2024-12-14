"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { withErrorHandling } from "./shared";

// Input validation schema
const DomainSchema = z
	.string()
	.min(3, "Domain must be at least 3 characters")
	.max(255, "Domain is too long")
	.regex(/^[a-zA-Z0-9.-]+$/, "Invalid domain format");

export async function readPortfolioDomain(domain) {
	return withErrorHandling(async () => {
		// Validate input
		const validatedDomain = DomainSchema.parse(domain);

		// Retrieve users with the specified domain
		const { users } = await clerkClient.users.getUserList({
			// Filter users based on metadata
			query: {
				publicMetadata: {
					domain: validatedDomain,
				},
			},
		});

		// Log and return users
		console.log("Domain users: ", users);
		return users.data;
	});
}

export async function addPortfolioDomain(domain) {
	return withErrorHandling(async () => {
		// Validate input
		const validatedDomain = DomainSchema.parse(domain);

		// Get authenticated user
		const { userId } = auth();
		if (!userId) {
			throw new Error("User not authenticated");
		}

		// Update user metadata
		const updatedUser = await clerkClient.users.updateUser(userId, {
			publicMetadata: {
				domain: validatedDomain,
			},
		});

		console.log("Updated user: ", updatedUser);
		return updatedUser;
	});
}
