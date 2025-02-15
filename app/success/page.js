"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { logger } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";

function PaymentStatusContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isProcessing, setIsProcessing] = useState(true);

	// Get all required parameters
	const status = searchParams.get("status");
	const tx_ref = searchParams.get("tx_ref");

	useEffect(() => {
		const verifyPayment = async () => {
			logger.info("Starting payment verification", {
				tx_ref,
				status,
				status,
			});

			if (!tx_ref || !status) {
				logger.error("Missing verification parameters", {
					tx_ref,
					status,
				});
				toast.error("Invalid payment verification data");
				setIsProcessing(false);
				return;
			}

			try {
				logger.info("Sending verification request");
				const response = await fetch("/api/payment/verify", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						tx_ref,
						status,
					}),
				});

				const data = await response.json();
				logger.info("Verification response received", {
					success: response.ok,
					data,
				});

				if (!response.ok) {
					logger.error("Verification request failed", {
						status: response.status,
						data,
					});
					throw new Error(
						data.message || "Payment verification failed"
					);
				}

				if (status === "successful") {
					logger.info("Payment verified successfully");
					toast.success("Payment verified successfully!");
				} else {
					logger.warn("Payment was not successful", { status });
					toast.error("Payment was not successful");
				}

				logger.info("Payment verification completed:", data);
			} catch (error) {
				logger.error("Payment verification error:", {
					message: error.message,
					stack: error.stack,
				});
				toast.error(error.message || "Error verifying payment");
				logger.error("Payment verification error:", error);
			} finally {
				setIsProcessing(false);
			}
		};

		verifyPayment();
	}, [status, tx_ref]);

	if (isProcessing) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
				<Spinner className="w-8 h-8" />
				<p className="text-lg">Verifying your payment...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
			<div className="text-center space-y-4">
				<h1 className="text-3xl font-semibold">
					{status === "successful"
						? "Payment Successful!"
						: "Payment Failed"}
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{status === "successful"
						? "Your subscription has been activated"
						: "There was an issue with your payment"}
				</p>
			</div>

			<div className="flex gap-4">
				<Button
					onClick={() => router.push("/dashboard")}
					variant={status === "successful" ? "default" : "outline"}
				>
					Go to Dashboard
				</Button>
				{status !== "successful" && (
					<Button
						onClick={() => router.push("/pricing")}
						variant="default"
					>
						Try Again
					</Button>
				)}
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PaymentStatusContent />
		</Suspense>
	);
}
