"use client";

import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BaseCard } from "./base-card";
import { useState, useEffect } from "react";
import { defaultPortfolio, portfolioSchema } from "@/schema/portfolio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/utils";
import { PortfolioDialog } from "@/components/dialogs/portfolio-dialog";

export const CreatePortfolioCard = () => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(true);
	};

	const form = useForm({
		resolver: zodResolver(portfolioSchema),
		defaultValues: defaultPortfolio,
	});
	const {
		reset,
		formState: { errors, defaultValues },
	} = form;

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.error("Form Validation Errors:", errors);
		}
	}, [errors, defaultValues]);

	return (
		<>
			<BaseCard onClick={onClick}>
				<Plus size={64} weight="thin" />
				<div
					className={cn(
						"absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
						"bg-gradient-to-t from-background/80 to-transparent"
					)}
				>
					<h4 className="font-medium">
						{`Create a new portfolio`}
						{/* <KeyboardShortcut className="ml-2">^N</KeyboardShortcut> */}
					</h4>
					<p className="text-xs opacity-75">{`Start a new presentation`}</p>
				</div>
			</BaseCard>
			<PortfolioDialog
				form={form}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</>
	);
};
