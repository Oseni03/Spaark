import { withErrorHandling } from "./shared";
import { prisma } from "@/lib/db";

// Function to handle successful payments
export async function handleCancelledSubscription(data) {
	return withErrorHandling(async () => {
		const {
			customer: { email },
		} = data;

		// Update cancelled user subscription
		const user = await prisma.user.update({
			where: { email },
			data: {
				subscribed: false,
				updatedAt: new Date(),
			},
		});

		return user;
	});
}
