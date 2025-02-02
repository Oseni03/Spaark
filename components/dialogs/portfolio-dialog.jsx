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
import { createId } from "@paralleldrive/cuid2";
import { Checkbox } from "../ui/checkbox";
import { defaultPortfolio } from "@/schema/sections";
import { DomainConfiguration } from "../domain-configuration";
import { DomainStatus } from "../domain-status";
import { useEffect } from "react";
import { useOrganizationContext } from "@/context/OrganizationContext";

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
				isLive: currentPortfolio?.isLive ?? false,
				isPrimary: currentPortfolio?.isPrimary ?? false,
				customDomain: currentPortfolio?.customDomain || "",
			});
		}
	}, [isOpen, currentPortfolio, reset]);

	const onSubmit = async (data) => {
		try {
			if (data.customDomain) {
				// Handle domain update
				const domainResponse = await fetch("/api/domains", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						domain: data.customDomain,
						portfolioId:
							currentPortfolio?.id || data.id || createId(),
					}),
				});

				if (!domainResponse.ok) {
					throw new Error("Failed to update domain");
				}
			}

			// Update portfolio
			if (currentPortfolio) {
				dispatch(
					updatePortfolioInDatabase({
						id: currentPortfolio.id,
						data: {
							...currentPortfolio,
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
			console.error("Error updating portfolio:", error);
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

					<Controller
						name="customDomain"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Custom Domain</label>
								<div className="relative flex w-full max-w-md">
									<Input
										{...field}
										placeholder="yourdomain.com"
									/>
									{field.value && (
										<div className="absolute right-3 z-10 flex h-full items-center">
											<DomainStatus
												domain={field.value}
											/>
										</div>
									)}
								</div>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
							</div>
						)}
					/>

					{currentPortfolio?.customDomain && (
						<DomainConfiguration
							domain={currentPortfolio.customDomain}
						/>
					)}

					<Controller
						name="isLive"
						control={control}
						render={({ field, fieldState }) => (
							<div className="items-top flex space-x-2">
								<Checkbox
									id="isLive"
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="isLive"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Public
									</label>
									<p className="text-sm text-muted-foreground">
										Make this portfolio public.
									</p>
								</div>
							</div>
						)}
					/>

					<Controller
						name="isPrimary"
						control={control}
						render={({ field, fieldState }) => (
							<div className="items-top flex space-x-2">
								<Checkbox
									id="isPrimary"
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="isPrimary"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Primary
									</label>
									<p className="text-sm text-muted-foreground">
										Make this portfolio your primary
										portfolio.
									</p>
								</div>
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
