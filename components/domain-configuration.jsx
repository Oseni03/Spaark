"use client";

import { useState, useEffect } from "react";
import {
	AlertCircle,
	XCircle,
	CheckCircle2,
	Copy,
	ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDomainResponse, getConfigResponse } from "@/lib/domains";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function DomainConfiguration({ domain }) {
	const [recordType, setRecordType] = useState("A");
	const [status, setStatus] = useState("Checking...");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [configData, setConfigData] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function checkDomain() {
			if (!domain) return;

			setLoading(true);
			setError(null);

			try {
				const [domainData, configData] = await Promise.all([
					getDomainResponse(domain),
					getConfigResponse(domain),
				]);

				if (!isMounted) return;

				setConfigData(configData);

				if (domainData.error) {
					setStatus("Invalid Configuration");
					setError(domainData.error.message);
				} else if (!domainData.verified) {
					setStatus("Pending Verification");
				} else if (configData.misconfigured) {
					setStatus("Invalid Configuration");
					setError("DNS records are not properly configured");
				} else {
					setStatus("Valid Configuration");
				}
			} catch (error) {
				if (isMounted) {
					console.error("Error checking domain:", error);
					setStatus("Configuration Error");
					setError("Failed to check domain configuration");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		checkDomain();
	}, [domain]);

	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success("Copied to clipboard");
			})
			.catch(() => {
				toast.error("Failed to copy");
			});
	};

	const getStatusIcon = () => {
		switch (status) {
			case "Valid Configuration":
				return <CheckCircle2 className="h-5 w-5 text-green-500" />;
			case "Pending Verification":
				return <AlertCircle className="h-5 w-5 text-yellow-500" />;
			default:
				return <XCircle className="h-5 w-5 text-red-500" />;
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case "Valid Configuration":
				return "text-green-600";
			case "Pending Verification":
				return "text-yellow-600";
			default:
				return "text-red-600";
		}
	};

	if (loading) {
		return (
			<div className="border-t border-stone-200 px-5 py-3">
				<div className="flex items-center space-x-2 mb-4">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<p className="text-lg font-semibold">
						Checking configuration...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="border-t border-stone-200 px-5 py-3">
			<div className="mb-4 flex items-center space-x-2">
				{getStatusIcon()}
				<p className={cn("text-lg font-semibold", getStatusColor())}>
					{status}
				</p>
			</div>

			{error ? (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			) : (
				<div className="space-y-4">
					<div className="flex space-x-4 mb-4">
						<button
							type="button"
							onClick={() => setRecordType("A")}
							className={cn(
								"pb-1 border-b-2 transition-all text-sm font-medium",
								recordType === "A"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							)}
						>
							A Record (recommended)
						</button>
						<button
							type="button"
							onClick={() => setRecordType("CNAME")}
							className={cn(
								"pb-1 border-b-2 transition-all text-sm font-medium",
								recordType === "CNAME"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							)}
						>
							CNAME Record
						</button>
					</div>

					<div className="bg-muted p-4 rounded-md">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div>
								<p className="font-medium mb-2 text-sm">Type</p>
								<div className="flex items-center gap-2">
									<p className="font-mono text-sm">
										{recordType}
									</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											copyToClipboard(recordType)
										}
										className="h-6 w-6 p-0"
									>
										<Copy className="h-3 w-3" />
									</Button>
								</div>
							</div>
							<div>
								<p className="font-medium mb-2 text-sm">Name</p>
								<div className="flex items-center gap-2">
									<p className="font-mono text-sm">
										{recordType === "A" ? "@" : "www"}
									</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											copyToClipboard(
												recordType === "A" ? "@" : "www"
											)
										}
										className="h-6 w-6 p-0"
									>
										<Copy className="h-3 w-3" />
									</Button>
								</div>
							</div>
							<div>
								<p className="font-medium mb-2 text-sm">
									Value
								</p>
								<div className="flex items-center gap-2">
									<p className="font-mono text-sm">
										{recordType === "A"
											? "76.76.21.21"
											: `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
									</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											copyToClipboard(
												recordType === "A"
													? "76.76.21.21"
													: `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
											)
										}
										className="h-6 w-6 p-0"
									>
										<Copy className="h-3 w-3" />
									</Button>
								</div>
							</div>
							<div>
								<p className="font-medium mb-2 text-sm">TTL</p>
								<div className="flex items-center gap-2">
									<p className="font-mono text-sm">86400</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => copyToClipboard("86400")}
										className="h-6 w-6 p-0"
									>
										<Copy className="h-3 w-3" />
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
						<h4 className="font-medium mb-2 text-blue-900">
							Next Steps:
						</h4>
						<ol className="text-sm text-blue-800 space-y-1">
							<li>
								1. Log into your domain provider&apos;s DNS
								management panel
							</li>
							<li>2. Add the DNS record above to your domain</li>
							<li>3. Wait up to 24 hours for DNS propagation</li>
							<li>
								4. Your domain will automatically become active
								once configured
							</li>
						</ol>
						<div className="mt-3">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									window.open(`https://${domain}`, "_blank")
								}
								className="text-blue-700 border-blue-300 hover:bg-blue-100"
							>
								<ExternalLink className="h-3 w-3 mr-1" />
								Test Domain
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
