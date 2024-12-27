"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { logger } from "@/lib/utils";

function PaymentStatusContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const status = searchParams.get("status");
	const tx_ref = searchParams.get("tx_ref");

	useEffect(() => {
		const updateTransaction = async () => {
			if (!tx_ref || !status) return;

			try {
				const response = await fetch("/api/payment-callback", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tx_ref, status }),
				});

				if (!response.ok) {
					logger.error(
						"Failed to update transaction:",
						await response.text()
					);
					return;
				}

				const data = await response.json();
				logger.info("Transaction updated successfully:", data);
			} catch (error) {
				logger.error("Error updating transaction:", error);
			}
		};

		updateTransaction();
	}, [status, tx_ref]);

	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<h1 className="text-3xl font-semibold text-center">
				{status === "successful"
					? "Payment successful"
					: "Payment Unsuccessful"}
			</h1>
			<Button onClick={() => router.push("/builder")} className="mt-4">
				Back to dashboard
			</Button>
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
