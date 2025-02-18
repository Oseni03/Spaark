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
	addPortfolioInDatabase,
	updatePortfolioInDatabase,
} from "@/redux/thunks/portfolio";
import { defaultPortfolio } from "@/schema/sections";
import { useEffect, useState } from "react";
import { useOrganizationContext } from "@/context/OrganizationContext";
import { logger } from "@/lib/utils";

export const PortfolioDialog = ({
	form,
	currentPortfolio,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;
	const { organization, canManagePortfolios } = useOrganizationContext();

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
		try {
			if (currentPortfolio) {
				dispatch(
					updatePortfolioInDatabase({
						id: currentPortfolio.id,
						data: {
							...data,
							organizationId: organization?.id || null,
						},
					})
				);
			} else {
				dispatch(
					addPortfolioInDatabase({
						...defaultPortfolio,
						...data,
						organizationId: organization?.id || null,
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

	// Disable form if user can't manage portfolios
	if (organization && !canManagePortfolios) {
		return <div>You don&apos;t have permission to manage portfolios</div>;
	}

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
								<Input
									{...field}
									placeholder="Enter portfolio name"
								/>
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
						<Button type="submit">
							{currentPortfolio
								? "Update Portfolio"
								: "Add Portfolio"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
