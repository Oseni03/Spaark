"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PaymentStatusContent() {
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
					console.error(
						"Failed to update transaction:",
						await response.text()
					);
					return;
				}

				const data = await response.json();
				console.log("Transaction updated successfully:", data);
			} catch (error) {
				console.error("Error updating transaction:", error);
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
