"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Globe, Plus, Trash } from "@phosphor-icons/react";
import { updateDomain } from "@/services/domain";
import { DomainStatus } from "./domain-status";
import { DomainConfiguration } from "./domain-configuration";
import { validDomainRegex } from "@/lib/domains";
import { toast } from "sonner";

export function DomainSettings() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();
	const [newDomain, setNewDomain] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const handleDomainSubmit = async (e) => {
		e.preventDefault();
		if (!validDomainRegex.test(newDomain)) {
			toast.error("Please enter a valid domain");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await updateDomain({
				portfolioId,
				domain: newDomain,
				dispatch,
				portfolio,
			});

			if (result.success) {
				toast.success("Domain updated successfully");
				setNewDomain("");
			} else {
				toast.error(result.error || "Failed to update domain");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemoveDomain = async () => {
		setIsSubmitting(true);
		try {
			const result = await updateDomain({
				portfolioId,
				domain: "",
				dispatch,
				portfolio,
			});

			if (result.success) {
				toast.success("Domain removed successfully");
			} else {
				toast.error(result.error || "Failed to remove domain");
			}
		} catch (error) {
			toast.error("An error occurred");
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
							<DomainStatus domain={portfolio.customDomain} />
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
					<Input
						placeholder="yourdomain.com"
						value={newDomain}
						onChange={(e) => setNewDomain(e.target.value)}
					/>
					<Button type="submit" disabled={isSubmitting}>
						<Plus className="h-4 w-4 mr-2" />
						Add Domain
					</Button>
				</form>
			)}
		</section>
	);
}
