"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Globe, Plus, Trash } from "@phosphor-icons/react";
import { DomainStatus } from "./domain-status";
import { DomainConfiguration } from "./domain-configuration";
import { validDomainRegex } from "@/lib/domains";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";

export function DomainSettings() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();
	const [newDomain, setNewDomain] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [domainStatus, setDomainStatus] = useState(null);

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const handleDomainSubmit = async (e) => {
		e.preventDefault();

		// Validation checks
		if (!validDomainRegex.test(newDomain)) {
			toast.error("Please enter a valid domain");
			return;
		}

		if (newDomain.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
			toast.error(
				`Cannot use ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} as your custom domain`
			);
			return;
		}

		// Only proceed if domain needs configuration
		if (domainStatus !== "Valid") {
			setIsSubmitting(true);
			try {
				// First verify/add domain with Vercel
				const domainResponse = await fetch("/api/domains", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ domain: newDomain }),
				});

				if (!domainResponse.ok) {
					const error = await domainResponse.json();
					logger.error("Domain error: ", error);
					throw new Error(
						error.error?.message || "Failed to add domain"
					);
				}

				// Update portfolio directly using the thunk
				const result = await dispatch(
					updatePortfolioInDatabase({
						id: portfolioId,
						data: { customDomain: newDomain },
					})
				).unwrap();

				if (result.success) {
					toast.success("Domain added successfully");
				}
			} catch (error) {
				toast.error(error.message);
				logger.error("Error adding domain:", error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleRemoveDomain = async () => {
		if (!portfolio?.customDomain) return;

		setIsSubmitting(true);
		try {
			// First remove from Vercel
			const response = await fetch(
				`/api/domains?domain=${portfolio.customDomain}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to remove domain configuration");
			}

			// Update portfolio directly using the thunk
			const result = await dispatch(
				updatePortfolioInDatabase({
					id: portfolioId,
					data: { customDomain: null },
				})
			).unwrap();

			if (result) {
				toast.success("Domain removed successfully");
			}
		} catch (error) {
			toast.error(error.message);
			logger.error("Error removing domain:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="domains" className="flex flex-col gap-y-4">
			<header>
				<h2 className="text-xl font-semibold">Custom Domain</h2>
				<p className="text-sm text-muted-foreground">
					Configure a custom domain for your portfolio
				</p>
			</header>

			{portfolio?.customDomain ? (
				<Card className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Globe className="h-4 w-4" />
							<span>{portfolio.customDomain}</span>
							<DomainStatus
								domain={portfolio.customDomain}
								onStatusChange={setDomainStatus}
							/>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleRemoveDomain}
							disabled={isSubmitting}
						>
							<Trash className="h-4 w-4" />
						</Button>
					</div>
					<DomainConfiguration domain={portfolio.customDomain} />
				</Card>
			) : (
				<form onSubmit={handleDomainSubmit} className="flex gap-2">
					<div className="flex-1 relative">
						<Input
							placeholder="yourdomain.com"
							value={newDomain}
							onChange={(e) => setNewDomain(e.target.value)}
						/>
						{newDomain && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								<DomainStatus
									domain={newDomain}
									onStatusChange={setDomainStatus}
								/>
							</div>
						)}
					</div>
					<Button
						type="submit"
						disabled={
							isSubmitting ||
							!newDomain ||
							domainStatus === "Valid"
						}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Domain
					</Button>
				</form>
			)}
		</section>
	);
}
