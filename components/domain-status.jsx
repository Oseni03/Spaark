"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { getDomainResponse, verifyDomain } from "@/lib/domains";
import { cn } from "@/lib/utils";

export function DomainStatus({ domain, onStatusChange, className }) {
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function checkDomain() {
			if (!domain) return;

			setLoading(true);
			setError(null);

			try {
				// First check if domain exists in Vercel
				const response = await getDomainResponse(domain);

				if (!isMounted) return;

				if (response.error) {
					// Domain not found in Vercel - needs to be added
					setStatus("NotConfigured");
					onStatusChange && onStatusChange("NotConfigured");
				} else if (!response.verified) {
					// Domain exists but not verified - try to verify
					try {
						await verifyDomain(domain);
						if (isMounted) {
							setStatus("Pending");
							onStatusChange && onStatusChange("Pending");
						}
					} catch (verifyError) {
						if (isMounted) {
							setStatus("Pending");
							onStatusChange && onStatusChange("Pending");
						}
					}
				} else {
					setStatus("Valid");
					onStatusChange && onStatusChange("Valid");
				}
			} catch (error) {
				if (isMounted) {
					console.error("Error checking domain:", error);
					setStatus("Invalid");
					setError(error.message);
					onStatusChange && onStatusChange("Invalid");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		checkDomain();

		return () => {
			isMounted = false;
		};
	}, [domain, onStatusChange]);

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
