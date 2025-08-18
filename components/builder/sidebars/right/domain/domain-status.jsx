"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

export function DomainStatus({ domain, onStatusChange, className }) {
	const { portfolioId } = useParams();
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(null);
	const [error, setError] = useState(null);

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	useEffect(() => {
		async function checkDomain() {
			if (!domain) return;

			// If domain is already verified in database, skip the check
			if (portfolio?.domainVerified) {
				setStatus("Valid");
				setError(null);
				setLoading(false);
				onStatusChange && onStatusChange("Valid");
				return;
			}

			setLoading(true);
			setError(null);

			try {
				// Check domain status and configuration
				const response = await fetch(
					`/api/domains/check?domain=${domain}`
				);

				if (!response.ok) {
					logger.error("Domain check API request failed", {
						status: response.status,
						statusText: response.statusText,
					});
					throw new Error("Failed to fetch domain data");
				}

				const {
					data: { domain: domainData, config: configData },
				} = await response.json();

				if (domainData.error) {
					// Domain not found in Vercel - needs to be added
					setStatus("NotConfigured");
					onStatusChange && onStatusChange("NotConfigured");
				} else if (!domainData.verified) {
					// Domain exists but not verified - show pending status
					setStatus("Pending");
					onStatusChange && onStatusChange("Pending");
				} else if (configData.misconfigured) {
					// Domain verified but DNS is misconfigured
					setStatus("Invalid");
					setError("DNS records are not properly configured");
					onStatusChange && onStatusChange("Invalid");
				} else {
					// Domain is valid and properly configured
					setStatus("Valid");
					onStatusChange && onStatusChange("Valid");
				}
			} catch (error) {
				console.error("Error checking domain:", error);
				setStatus("Invalid");
				setError(error.message);
				onStatusChange && onStatusChange("Invalid");
			} finally {
				setLoading(false);
			}
		}

		checkDomain();
	}, [domain, onStatusChange, portfolio?.domainVerified]);

	if (loading) {
		return (
			<div className={cn("flex items-center gap-1", className)}>
				<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
				<span className="text-xs text-muted-foreground">
					Checking...
				</span>
			</div>
		);
	}

	switch (status) {
		case "Valid":
			return (
				<div className={cn("flex items-center gap-1", className)}>
					<CheckCircle2 className="h-4 w-4 text-green-500" />
					<span className="text-xs text-green-600">Active</span>
				</div>
			);
		case "Pending":
			return (
				<div className={cn("flex items-center gap-1", className)}>
					<AlertCircle className="h-4 w-4 text-yellow-500" />
					<span className="text-xs text-yellow-600">Pending</span>
				</div>
			);
		case "NotConfigured":
			return (
				<div className={cn("flex items-center gap-1", className)}>
					<XCircle className="h-4 w-4 text-red-500" />
					<span className="text-xs text-red-600">Not Configured</span>
				</div>
			);
		case "Invalid":
			return (
				<div className={cn("flex items-center gap-1", className)}>
					<XCircle className="h-4 w-4 text-red-500" />
					<span className="text-xs text-red-600">Error</span>
				</div>
			);
		default:
			return null;
	}
}
