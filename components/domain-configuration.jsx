"use client";

import { useState, useEffect } from "react";
import { AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDomainResponse, getConfigResponse } from "@/lib/domains";

export function DomainConfiguration({ domain }) {
	const [recordType, setRecordType] = useState("A");
	const [status, setStatus] = useState("Checking...");
	const [error, setError] = useState(null);

	useEffect(() => {
		async function checkDomain() {
			try {
				const [domainData, configData] = await Promise.all([
					getDomainResponse(domain),
					getConfigResponse(domain),
				]);

				if (domainData.error) {
					setStatus("Invalid Configuration");
					setError(domainData.error.message);
				} else if (!domainData.verified) {
					setStatus("Pending Verification");
				} else if (configData.misconfigured) {
					setStatus("Invalid Configuration");
				} else {
					setStatus("Valid Configuration");
				}
			} catch (error) {
				console.error("Error checking domain:", error);
				setStatus("Configuration Error");
			}
		}

		checkDomain();
	}, [domain]);

	return (
		<div className="border-t border-stone-200 px-5 py-3">
			<div className="mb-4 flex items-center space-x-2">
				{status === "Pending Verification" ? (
					<AlertCircle className="text-yellow-500" />
				) : status !== "Valid Configuration" ? (
					<XCircle className="text-red-500" />
				) : null}
				<p className="text-lg font-semibold">{status}</p>
			</div>

			{error ? (
				<p className="text-sm text-red-500 mb-4">{error}</p>
			) : (
				<div>
					<div className="flex space-x-4 mb-4">
						<button
							type="button"
							onClick={() => setRecordType("A")}
							className={`pb-1 border-b-2 transition-all ${
								recordType === "A"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground"
							}`}
						>
							A Record (recommended)
						</button>
						<button
							type="button"
							onClick={() => setRecordType("CNAME")}
							className={`pb-1 border-b-2 transition-all ${
								recordType === "CNAME"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground"
							}`}
						>
							CNAME Record
						</button>
					</div>

					<div className="bg-muted p-4 rounded-md">
						<div className="grid grid-cols-4 gap-4">
							<div>
								<p className="font-medium mb-2">Type</p>
								<p className="font-mono">{recordType}</p>
							</div>
							<div>
								<p className="font-medium mb-2">Name</p>
								<p className="font-mono">
									{recordType === "A" ? "@" : "www"}
								</p>
							</div>
							<div>
								<p className="font-medium mb-2">Value</p>
								<p className="font-mono">
									{recordType === "A"
										? "76.76.21.21"
										: `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
								</p>
							</div>
							<div>
								<p className="font-medium mb-2">TTL</p>
								<p className="font-mono">86400</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
