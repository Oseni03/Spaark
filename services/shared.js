"use server";

export async function withErrorHandling(action) {
	try {
		const result = await action();
		return { success: true, data: result };
	} catch (error) {
		console.log("Server Action Error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred",
		};
	}
}
