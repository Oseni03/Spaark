import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { createPortfolioWithSectionsThunks } from "@/redux/thunks/portfolio";

export const useImportResume = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useDispatch();

	const importResumeFn = useCallback(
		async (data) => {
			setLoading(true);
			setError(null);

			try {
				const result = dispatch(
					createPortfolioWithSectionsThunks(data)
				);

				toast({
					title: "Resume imported successfully",
					description:
						"Your resume has been imported and is ready to edit",
				});

				return result;
			} catch (error) {
				setError(error);
				toast({
					variant: "error",
					title: "Failed to import resume",
					description:
						error instanceof Error
							? error.message
							: "An unknown error occurred",
				});
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[dispatch]
	);

	return { importResume: importResumeFn, loading, error };
};
