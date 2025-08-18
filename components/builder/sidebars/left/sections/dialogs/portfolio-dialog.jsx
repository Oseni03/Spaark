"use client";

import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	addPortfolioInDatabase,
	createPortfolioWithSectionsThunks,
	updatePortfolioInDatabase,
} from "@/redux/thunks/portfolio";
import { defaultMain, defaultPortfolio } from "@/schema/sections";
import { useEffect, useState } from "react";
import { logger, generateRandomName } from "@/lib/utils";
import slugify from "@sindresorhus/slugify";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import samplePortfolio from "@/lib/portfolio";
import { createId } from "@paralleldrive/cuid2";
import { MagicWand } from "@phosphor-icons/react";

export const PortfolioDialog = ({
	form,
	currentPortfolio,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	// Initialize form with default values when dialog opens
	useEffect(() => {
		if (isOpen) {
			reset({
				name: currentPortfolio?.name || "",
				slug: currentPortfolio?.slug || "",
			});
		}
	}, [isOpen, currentPortfolio, reset]);

	const onSubmit = async (data) => {
		logger.info("Portfolio data submitted: ", data);
		try {
			if (currentPortfolio) {
				dispatch(
					updatePortfolioInDatabase({
						id: currentPortfolio.id,
						data: {
							...data,
						},
					})
				);
			} else {
				dispatch(
					addPortfolioInDatabase({
						...defaultPortfolio,
						...data,
						id: createId(),
					})
				);
			}

			setIsOpen(false);
			reset();
		} catch (error) {
			logger.error("Error updating portfolio:", error);
			toast.error(error.message);
		}
	};

	const onGenerateRandomName = () => {
		const name = generateRandomName();
		form.setValue("name", name);
		form.setValue("slug", slugify(name));
	};

	const onCreateSample = () => {
		const name = generateRandomName();
		const sample = {
			...defaultMain,
			...samplePortfolio,
			id: createId(), // Remove ID to create a new one
			name,
			slug: slugify(name),
		};
		logger.info("Sample portfolio", sample);
		dispatch(createPortfolioWithSectionsThunks(sample));

		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentPortfolio
							? "Edit Portfolio"
							: "Add New Portfolio"}
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 pr-3"
				>
					<Controller
						name="name"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Portfolio Name</label>
								<div className="flex items-center relative">
									<Input
										{...field}
										placeholder="Enter portfolio name"
										className="pr-10"
									/>

									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													className="absolute right-0 h-full px-3"
													size="sm"
													onClick={
														onGenerateRandomName
													}
												>
													<MagicWand />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													Generate a random name for
													your portfolio
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
							</div>
						)}
					/>

					<Controller
						name="slug"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Slug</label>
								<Input {...field} placeholder="Enter slug" />
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
							</div>
						)}
					/>

					<div className="flex justify-end space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>

						<div className="flex">
							<Button type="submit" className="rounded-r-none">
								{currentPortfolio
									? "Update Portfolio"
									: "Create"}
							</Button>
							{!currentPortfolio && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="default"
											className="border-l-0 border-l-slate-300 border-l-solid px-2 rounded-l-none"
										>
											<ChevronDown className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={onCreateSample}
										>
											Create Sample Portfolio
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
