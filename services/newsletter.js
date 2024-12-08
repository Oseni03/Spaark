import { withErrorHandling } from "./shared";
import { prisma } from "@/lib/db";

export async function createSubscriber(email) {
	return withErrorHandling(async () => {
		// Validate the email
		if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			throw new Error("Invalid email address");
		}
		// Check if email already exists
		const existingSubscriber = await prisma.newsletter.findUnique({
			where: { email },
		});
		if (existingSubscriber) {
			return existingSubscriber;
		}
		const newSubscriber = await prisma.newsletter.create({
			data: {
				email,
			},
		});
		return newSubscriber;
	});
}
