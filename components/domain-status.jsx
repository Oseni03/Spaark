"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getDomainResponse, verifyDomain } from "@/lib/domains";

export function DomainStatus({ domain, onStatusChange }) {
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		async function checkDomain() {
			if (!domain) return;

			try {
				// First check if domain exists in Vercel
				const response = await getDomainResponse(domain);

				if (response.error) {
					// Domain not found in Vercel - needs to be added
					setStatus("NotConfigured");
					onStatusChange && onStatusChange("NotConfigured");
				} else if (!response.verified) {
					await verifyDomain(domain);
					setStatus("Pending");
					onStatusChange && onStatusChange("Pending");
				} else {
					setStatus("Valid");
					onStatusChange && onStatusChange("Valid");
				}
			} catch (error) {
				console.error("Error checking domain:", error);
				setStatus("Invalid");
				onStatusChange && onStatusChange("Invalid");
			} finally {
				setLoading(false);
			}
		}

		checkDomain();
	}, [domain, onStatusChange]);

	if (loading) {
		return <div className="h-4 w-4 animate-spin rounded-full border-2" />;
	}

	return status === "Valid" ? (
		<CheckCircle2 className="h-4 w-4 text-green-500" />
	) : (
		<XCircle className="h-4 w-4 text-red-500" />
	);
}
