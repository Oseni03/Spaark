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
		<div className="border-t border-stone-200 px-10 pb-5 pt-7 dark:border-stone-700">
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
					<div className="flex justify-start space-x-4">
						<button
							type="button"
							onClick={() => setRecordType("A")}
							className={cn(
								"border-b-2 pb-1 text-sm transition-all duration-150",
								recordType === "A"
									? "border-black text-black dark:border-white dark:text-white"
									: "border-transparent text-stone-400"
							)}
						>
							A Record (recommended)
						</button>
						<button
							type="button"
							onClick={() => setRecordType("CNAME")}
							className={cn(
								"border-b-2 pb-1 text-sm transition-all duration-150",
								recordType === "CNAME"
									? "border-black text-black dark:border-white dark:text-white"
									: "border-transparent text-stone-400"
							)}
						>
							CNAME Record
						</button>
					</div>

					<div className="mt-4">
						<div className="flex items-start justify-start space-x-10 rounded-md bg-stone-50 p-4 dark:bg-stone-800">
							<div>
								<p className="text-sm font-bold">Type</p>
								<p className="mt-2 font-mono text-sm">
									{recordType}
								</p>
							</div>
							<div>
								<p className="text-sm font-bold">Name</p>
								<p className="mt-2 font-mono text-sm">
									{recordType === "A" ? "@" : "www"}
								</p>
							</div>
							<div>
								<p className="text-sm font-bold">Value</p>
								<p className="mt-2 font-mono text-sm">
									{recordType === "A"
										? "76.76.21.21"
										: `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
								</p>
							</div>
							<div>
								<p className="text-sm font-bold">TTL</p>
								<p className="mt-2 font-mono text-sm">86400</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
