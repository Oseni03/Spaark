"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getDomainResponse, verifyDomain } from "@/lib/domains";

export function DomainStatus({ domain }) {
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState(null);

	useEffect(() => {
		async function checkDomain() {
			if (!domain) return;

			try {
				const response = await getDomainResponse(domain);
				if (!response.verified) {
					await verifyDomain(domain);
				}
				setStatus(response.verified ? "Valid" : "Invalid");
			} catch (error) {
				console.error("Error checking domain:", error);
				setStatus("Invalid");
			} finally {
				setLoading(false);
			}
		}

		checkDomain();
	}, [domain]);

	if (loading) {
		return <div className="h-4 w-4 animate-spin rounded-full border-2" />;
	}

	return status === "Valid" ? (
		<CheckCircle2 className="h-4 w-4 text-green-500" />
	) : (
		<XCircle className="h-4 w-4 text-red-500" />
	);
}
