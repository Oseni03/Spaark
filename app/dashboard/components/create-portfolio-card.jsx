"use client";

import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BaseCard } from "./base-card";
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

export const CreatePortfolioCard = () => {
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
			<BaseCard
				onClick={handleOpen}
				className={cn(isLoading && "opacity-50 cursor-not-allowed")}
			>
				<Plus size={64} weight="thin" />
				<div
					className={cn(
						"absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
						"bg-gradient-to-t from-background/80 to-transparent"
					)}
				>
					<h4 className="font-medium">Create a new portfolio</h4>
					<p className="text-xs opacity-75">
						Start a new presentation
					</p>
				</div>
			</BaseCard>

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
