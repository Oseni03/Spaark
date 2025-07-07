"use client";

import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { defaultPortfolio, portfolioSchema } from "@/schema/sections";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/utils";

// Lazy load the dialog component
const PortfolioDialog = lazy(() =>
	import("@/components/dialogs/portfolio-dialog").then((mod) => ({
		default: mod.PortfolioDialog,
	}))
);

// Loading fallback component
const DialogSkeleton = () => (
	<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
		<div className="fixed left-[50%] top-[50%] h-fit w-full max-w-lg translate-x-[-50%] translate-y-[-50%] animate-pulse">
			<div className="bg-card rounded-lg p-6 shadow-lg">
				<div className="h-8 w-3/4 bg-muted rounded mb-4" />
				<div className="space-y-3">
					<div className="h-10 bg-muted rounded" />
					<div className="h-10 bg-muted rounded" />
				</div>
			</div>
		</div>
	</div>
);

export const CreateButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(portfolioSchema),
		defaultValues: defaultPortfolio,
	});

	const {
		reset,
		formState: { errors, defaultValues },
	} = form;

	// Memoize dialog open handler
	const handleOpen = useCallback(() => {
		if (isLoading) return;
		setIsLoading(true);
		setIsOpen(true);
		setIsLoading(false);
	}, [isLoading]);

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.error("Form Validation Errors:", errors);
		}
	}, [errors, defaultValues]);

	return (
		<>
			<Button
				onClick={handleOpen}
				disabled={isLoading}
				className="flex items-center gap-2"
			>
				<Plus size={16} weight="bold" />
				Create Portfolio
			</Button>

			{isOpen && (
				<Suspense fallback={<DialogSkeleton />}>
					<PortfolioDialog
						form={form}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
					/>
				</Suspense>
			)}
		</>
	);
};
