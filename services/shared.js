"use server";
import { z } from "zod";

// Comprehensive error handling utility
export async function withErrorHandling(action) {
	try {
		const result = await action();
		return { success: true, data: result };
	} catch (error) {
		console.log("Server Action Error:", error);

		// Specific error type handling
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join("; "),
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: false,
			error: "An unexpected error occurred",
		};
	}
}
