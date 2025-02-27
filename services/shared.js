"use server";
import { z } from "zod";
import { logger } from "@/lib/utils";

// Comprehensive error handling utility
export async function withErrorHandling(action) {
	try {
		logger.info("Entering withErrorHandling");

		// Add a check to ensure action is a function
		if (typeof action !== "function") {
			logger.error("withErrorHandling: action is not a function", action);
			throw new Error("Invalid action provided to withErrorHandling");
		}

		const result = await action();

		logger.info("withErrorHandling action completed successfully", result);

		return { success: true, data: result };
	} catch (error) {
		logger.error("withErrorHandling caught an error:", {
			errorName: error.name,
			errorMessage: error.message,
		});

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
