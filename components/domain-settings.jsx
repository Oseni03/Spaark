"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import {
	Globe,
	Plus,
	Trash,
	AlertCircle,
	CheckCircle2,
	XCircle,
	Loader2,
	Info,
} from "lucide-react";
import { DomainStatus } from "./domain-status";
import { DomainConfiguration } from "./domain-configuration";
import { validDomainRegex } from "@/lib/domains";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { updatePortfolio } from "@/redux/features/portfolioSlice";

export function DomainSettings() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();
	const [newDomain, setNewDomain] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const [domainStatus, setDomainStatus] = useState(null);
	const [validationError, setValidationError] = useState("");
	const [showRemoveDialog, setShowRemoveDialog] = useState(false);

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);
	const portfolioLoading = useSelector((state) => state.portfolios.loading);

	// Reset domain status when portfolio changes
	useEffect(() => {
		if (portfolio?.customDomain) {
			setDomainStatus(null);
		}
	}, [portfolio?.customDomain]);

	// Validate domain input
	const validateDomain = (domain) => {
		setValidationError("");

		if (!domain) return false;

		// Check if domain is too short
		if (domain.length < 3) {
			setValidationError("Domain must be at least 3 characters long");
			return false;
		}

		// Check if domain contains invalid characters
		if (!validDomainRegex.test(domain)) {
			setValidationError(
				"Please enter a valid domain (e.g., yourdomain.com)"
			);
			return false;
		}

		// Check if domain is the root domain
		if (domain.includes(process.env.NEXT_PUBLIC_ROOT_DOMAIN)) {
			setValidationError(
				`Cannot use ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} as your custom domain`
			);
			return false;
		}

		// Check if domain is already in use
		if (portfolio?.customDomain === domain) {
			setValidationError(
				"This domain is already configured for this portfolio"
			);
			return false;
		}

		return true;
	};

	const handleDomainChange = (e) => {
		const domain = e.target.value;
		setNewDomain(domain);
		validateDomain(domain);
	};

	const handleDomainSubmit = async (e) => {
		e.preventDefault();

		if (!validateDomain(newDomain)) {
			return;
		}

		setIsSubmitting(true);
		try {
			if (!portfolio.isLive) {
				throw new Error("Domain can only be added to a live portfolio");
			}
			// First verify/add domain with Vercel
			// Add domain to Vercel and update portfolio
			const domainResponse = await fetch("/api/domains", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					domain: newDomain,
					portfolioId: portfolioId,
				}),
			});

			if (!domainResponse.ok) {
				const error = await domainResponse.json();
				logger.error("Domain error: ", error);
				throw new Error(error.error || "Failed to add domain");
			}

			const resp = await domainResponse.json();

			if (resp.success) {
				dispatch(
					updatePortfolio({
						id: portfolioId,
						data: { customDomain: newDomain },
					})
				);
				toast.success(
					resp.data.message || "Domain added successfully!"
				);
				setNewDomain("");
				setDomainStatus(null);
				setValidationError("");

				// Refresh portfolio data
				// The portfolio will be updated via the API response
			} else {
				throw new Error(resp.error || "Failed to add domain");
			}
		} catch (error) {
			toast.error(error.message || "Failed to add domain");
			logger.error("Error adding domain:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemoveDomain = async () => {
		if (!portfolio?.customDomain) return;

		setIsRemoving(true);
		try {
			// Remove domain from Vercel and database
			const response = await fetch(
				`/api/domains?domain=${portfolio.customDomain}&portfolioId=${portfolioId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(
					error.error || "Failed to remove domain configuration"
				);
			}

			const result = await response.json();

			if (result.success) {
				dispatch(
					updatePortfolio({
						id: portfolioId,
						data: { customDomain: null },
					})
				);
				toast.success(result.message || "Domain removed successfully");
				setShowRemoveDialog(false);
				setDomainStatus(null);

				// Refresh portfolio data
				// The portfolio will be updated via the API response
			} else {
				throw new Error(result.error || "Failed to remove domain");
			}
		} catch (error) {
			toast.error(error.message || "Failed to remove domain");
			logger.error("Error removing domain:", error);
		} finally {
			setIsRemoving(false);
		}
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case "Valid":
				return (
					<Badge
						variant="default"
						className="bg-green-100 text-green-800"
					>
						Active
					</Badge>
				);
			case "Pending":
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-100 text-yellow-800"
					>
						Pending
					</Badge>
				);
			case "NotConfigured":
				return (
					<Badge variant="outline" className="text-muted-foreground">
						Not Configured
					</Badge>
				);
			default:
				return <Badge variant="destructive">Error</Badge>;
		}
	};

	const canSubmit =
		newDomain && !validationError && !isSubmitting && !portfolioLoading;

	return (
		<section id="domains" className="flex flex-col gap-y-4 sm:gap-y-6">
			<header>
				<h2 className="text-lg sm:text-xl font-semibold">
					Custom Domain
				</h2>
				<p className="text-sm text-muted-foreground">
					Configure a custom domain for your portfolio
				</p>
			</header>

			{portfolio?.customDomain ? (
				<Card className="p-4 sm:p-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-4">
						<div className="flex flex-row items-start gap-3 min-w-0">
							<Globe className="h-5 w-5 text-primary mb-1 sm:mb-0 flex-shrink-0 mt-0.5" />
							<div className="min-w-0 flex-1">
								<span className="font-medium break-all block">
									{portfolio.customDomain}
								</span>
								<div className="mt-1">
									<DomainStatus
										domain={portfolio.customDomain}
										onStatusChange={setDomainStatus}
									/>
								</div>
							</div>
							{domainStatus && (
								<div className="flex-shrink-0">
									{getStatusBadge(domainStatus)}
								</div>
							)}
						</div>
						<AlertDialog
							open={showRemoveDialog}
							onOpenChange={setShowRemoveDialog}
						>
							<AlertDialogTrigger asChild>
								<Button
									variant="icon"
									size="sm"
									disabled={isRemoving || portfolioLoading}
									className="flex-shrink-0"
								>
									{isRemoving ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash className="h-4 w-4" />
									)}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className="max-w-md mx-4">
								<AlertDialogHeader>
									<AlertDialogTitle>
										Remove Custom Domain
									</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to remove{" "}
										<strong>
											{portfolio.customDomain}
										</strong>{" "}
										from this portfolio? This action cannot
										be undone and will make your portfolio
										unavailable at this domain.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleRemoveDomain}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Remove Domain
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>

					{/* Show DNS configuration instructions if domain is not configured or pending and not verified in database */}
					{!portfolio.domainVerified &&
						(domainStatus === "NotConfigured" ||
							domainStatus === "Pending") && (
							<div className="mt-4">
								<DomainConfiguration
									domain={portfolio.customDomain}
								/>
							</div>
						)}
				</Card>
			) : (
				<div className="space-y-4">
					<Alert>
						<Info className="h-4 w-4" />
						<AlertDescription>
							Add a custom domain to make your portfolio
							accessible at your own domain name. You&apos;ll need
							to configure DNS settings with your domain provider.
						</AlertDescription>
					</Alert>

					<form onSubmit={handleDomainSubmit} className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="domain-input"
								className="text-sm font-medium"
							>
								Domain Name
							</label>
							<div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
								<div className="flex-1 relative">
									<Input
										id="domain-input"
										placeholder="yourdomain.com"
										value={newDomain}
										onChange={handleDomainChange}
										className={
											validationError
												? "border-red-500"
												: ""
										}
										disabled={
											isSubmitting || portfolioLoading
										}
									/>
									{newDomain && !validationError && (
										<div className="absolute right-3 top-1/2 -translate-y-1/2">
											<CheckCircle2 className="h-4 w-4 text-green-500" />
										</div>
									)}
									{validationError && (
										<div className="absolute right-3 top-1/2 -translate-y-1/2">
											<XCircle className="h-4 w-4 text-red-500" />
										</div>
									)}
								</div>
								<Button
									type="submit"
									disabled={!canSubmit}
									className="w-full sm:w-auto"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Adding...
										</>
									) : (
										<>
											<Plus className="h-4 w-4 mr-2" />
											Add Domain
										</>
									)}
								</Button>
							</div>
							{validationError && (
								<p className="text-sm text-red-500 flex items-center gap-1">
									<AlertCircle className="h-3 w-3 flex-shrink-0" />
									<span className="break-words">
										{validationError}
									</span>
								</p>
							)}
						</div>
					</form>

					<div className="bg-muted/50 p-3 rounded-lg">
						<h4 className="font-medium mb-2">How it works:</h4>
						<ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
							<li>
								1. Enter your domain name (e.g., yourdomain.com)
							</li>
							<li>2. We&apos;ll add it to our system</li>
							<li>
								3. Configure your DNS settings with the provided
								instructions
							</li>
							<li>
								4. Your portfolio will be live at your custom
								domain
							</li>
						</ol>
					</div>
				</div>
			)}
		</section>
	);
}
