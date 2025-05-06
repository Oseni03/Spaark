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
			const formattedError = error.errors
				.map((err) => {
					// Handle union errors specially
					if (err.code === "invalid_union") {
						return `${err.path.join(".")}: Please provide a valid value`;
					}
					// Handle null/undefined values
					if (
						err.code === "invalid_type" &&
						(err.received === "null" ||
							err.received === "undefined")
					) {
						return `${err.path.join(".")}: This field cannot be empty`;
					}
					return `${err.path.join(".")}: ${err.message}`;
				})
				.join("; ");

			return {
				success: false,
				error: formattedError,
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
