import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { logger } from "@/lib/utils";

export function useVerifyPayment() {
	const searchParams = useSearchParams();
	const status = searchParams.get("status");
	const tx_ref = searchParams.get("tx_ref");

	useEffect(() => {
		const verifyPayment = async () => {
			if (!tx_ref || !status) return;

			logger.info("Starting payment verification", { tx_ref, status });

			try {
				const response = await fetch("/api/payment/verify", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tx_ref, status }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.message || "Payment verification failed"
					);
				}

				if (status === "successful") {
					toast.success("Payment verified successfully!");
				} else if (status === "cancelled") {
					toast.error("Payment was cancelled");
				}

				// Clear the URL params after verification
				window.history.replaceState({}, "", window.location.pathname);
			} catch (error) {
				logger.error("Payment verification error:", error);
				toast.error(error.message || "Error verifying payment");
			}
		};

		verifyPayment();
	}, [status, tx_ref]);
}
