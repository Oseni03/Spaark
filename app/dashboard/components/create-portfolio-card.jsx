"use client";

import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BaseCard } from "./base-card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { defaultPortfolio, portfolioSchema } from "@/schema/sections";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/utils";
import { PortfolioDialog } from "@/components/dialogs/portfolio-dialog";
import { useSelector } from "react-redux";
import { useOrganizationContext } from "@/context/OrganizationContext";
import { toast } from "sonner";

export const CreatePortfolioCard = () => {
	const [isOpen, setIsOpen] = useState(false);
	const portfolios = useSelector((state) => state.portfolios.items);
	const user = useSelector((state) => state.user);
	const { isIndividualAccount } = useOrganizationContext();

	const onClick = () => {
		// Check if individual user has reached their portfolio limit
		if (
			isIndividualAccount &&
			portfolios.length >= (user?.portfolioLimit || 1)
		) {
			return toast.error("You've reached your portfolio limit.", {
				description: (
					<div>
						<Link
							href="/dashboard/settings"
							className="underline font-medium"
						>
							upgrade your account
						</Link>
						or join an organization.
					</div>
				),
			});
		}

		setIsOpen(true);
	};

	// If user has reached limit, show disabled state
	const isDisabled =
		isIndividualAccount && portfolios.length >= (user?.portfolioLimit || 1);

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
			<BaseCard
				onClick={onClick}
				className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
			>
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
					<p className="text-xs opacity-75">
						{isDisabled
							? "Portfolio limit reached"
							: "Start a new presentation"}
					</p>
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
