"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
	AlertCircle,
	XCircle,
	CheckCircle2,
	Copy,
	ExternalLink,
	RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";
import { logger } from "@/lib/utils";

export function DomainConfiguration({ domain }) {
	const { portfolioId } = useParams();
	const [status, setStatus] = useState("Checking...");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [verifying, setVerifying] = useState(false);
	const [configData, setConfigData] = useState(null);
	const [verificationRecords, setVerificationRecords] = useState([]);
	const dispatch = useDispatch();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	useEffect(() => {
		async function checkDomain() {
			if (!domain) return;

			// If domain is already verified in database, skip the check
			if (portfolio?.domainVerified) {
				setStatus("Valid Configuration");
				setError(null);
				setLoading(false);
				setVerificationRecords([]);
				return;
			}

			setLoading(true);
			setError(null);

			try {
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

				setConfigData(configData);

				if (domainData.error) {
					setStatus("Invalid Configuration");
					setError(domainData.error.message);
					setVerificationRecords(domainData.verification || []);
				} else if (!domainData.verified) {
					setStatus("Pending Verification");
					setVerificationRecords(domainData.verification || []);
				} else if (configData.misconfigured) {
					setStatus("Invalid Configuration");
					setError("DNS records are not properly configured");
					setVerificationRecords(domainData.verification || []);
				} else {
					setStatus("Valid Configuration");
					setVerificationRecords([]);
				}
			} catch (error) {
				console.error("Error checking domain:", error);
				setStatus("Configuration Error");
				setError("Failed to check domain configuration");
			} finally {
				setLoading(false);
			}
		}

		checkDomain();
	}, [domain, portfolio?.domainVerified]);

	const handleVerifyDomain = async () => {
		if (!domain || !portfolio) return;

		// If domain is already verified, don't run verification again
		if (portfolio.domainVerified) {
			toast.success("Domain is already verified and active");
			return;
		}

		setVerifying(true);
		try {
			const response = await fetch(`/api/domains/check?domain=${domain}`);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to verify domain");
			}

			const {
				data: { domain: domainData, config: configData },
				success,
			} = await response.json();

			if (success) {
				toast.success("Domain is verified and active");
				// Update status based on verification response
				if (domainData.error) {
					// Domain not found in Vercel - needs to be added
					setStatus("NotConfigured");
					setError(null);
				} else if (!domainData.verified) {
					// Domain exists but not verified - show pending status
					setStatus("Pending");
					setError(null);
				} else if (configData.misconfigured) {
					// Domain verified but DNS is misconfigured
					setStatus("Invalid");
					setError("DNS records are not properly configured");
				} else {
					// Domain is valid and properly configured
					setStatus("Valid");
					setError(null);
					// Mark domain as verified in database if not already
					if (!portfolio.domainVerified) {
						dispatch(
							updatePortfolioInDatabase({
								id: portfolioId,
								data: { domainVerified: true },
							})
						);
					}
				}
				// Update verification records if provided
				if (domainData.verification) {
					setVerificationRecords(domainData.verification || []);
				}
			} else {
				throw new Error(result.error || "Failed to verify domain");
			}
		} catch (error) {
			toast.error(error.message || "Failed to verify domain");
		} finally {
			setVerifying(false);
		}
	};

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
			<div className="border-t border-stone-200 px-4 py-3 sm:px-5">
				<div className="flex items-center space-x-2 mb-4">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<p className="text-base sm:text-lg font-semibold">
						Checking...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="border-t border-stone-200 px-4 py-3 sm:px-5">
			<div className="mb-4 flex items-center space-x-2">
				{getStatusIcon()}
				<p
					className={cn(
						"text-base sm:text-lg font-semibold",
						getStatusColor()
					)}
				>
					{status}
				</p>
			</div>

			{error ? (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			) : (
				<div className="space-y-4">
					{verificationRecords && (
						<div className="bg-muted p-3 sm:p-4 rounded-md">
							{verificationRecords.map((record, index) => (
								<div key={index} className="grid grid-cols-1">
									<div>
										<p className="font-medium mb-2 text-sm">
											Type
										</p>
										<div className="flex items-center gap-2">
											<p className="font-mono text-sm break-all">
												{record.type}
											</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(record.type)
												}
												className="h-6 w-6 p-0 flex-shrink-0"
											>
												<Copy className="h-3 w-3" />
											</Button>
										</div>
									</div>
									<div>
										<p className="font-medium mb-2 text-sm">
											Name
										</p>
										<div className="flex items-center gap-2">
											<p className="font-mono text-sm break-all">
												{record.domain}
											</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														record.domain
													)
												}
												className="h-6 w-6 p-0 flex-shrink-0"
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
											<p className="font-mono text-sm break-all">
												{record.value}
											</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(
														record.value
													)
												}
												className="h-6 w-6 p-0 flex-shrink-0"
											>
												<Copy className="h-3 w-3" />
											</Button>
										</div>
									</div>
									{/* <div>
									<p className="font-medium mb-2 text-sm">
										TTL
									</p>
									<div className="flex items-center gap-2">
										<p className="font-mono text-sm break-all">
											86400
										</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												copyToClipboard("86400")
											}
											className="h-6 w-6 p-0 flex-shrink-0"
										>
											<Copy className="h-3 w-3" />
										</Button>
									</div>
								</div> */}
								</div>
							))}
						</div>
					)}

					<div className="bg-blue-50 border border-blue-200 p-3 sm:p-4 rounded-md">
						<h4 className="font-medium mb-2 text-blue-900">
							Next Steps:
						</h4>
						<ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
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
						<div className="mt-3 grid gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									window.open(`https://${domain}`, "_blank")
								}
								className="text-blue-700 border-blue-300 hover:bg-blue-100 w-full sm:w-auto"
							>
								<ExternalLink className="h-3 w-3 mr-1" />
								Test Domain
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleVerifyDomain}
								disabled={
									verifying || portfolio?.domainVerified
								}
								className="text-green-700 border-green-300 hover:bg-green-100 w-full sm:w-auto"
							>
								{verifying ? (
									<RefreshCw className="h-3 w-3 mr-1 animate-spin" />
								) : (
									<RefreshCw className="h-3 w-3 mr-1" />
								)}
								{verifying
									? "Verifying..."
									: portfolio?.domainVerified
										? "Already Verified"
										: "Verify Domain"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
