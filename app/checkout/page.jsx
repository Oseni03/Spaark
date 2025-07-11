"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	CreditCard,
	Lock,
	Shield,
	CheckCircle2,
	ArrowLeft,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/utils";
import {
	SUBSCRIPTION_PLANS,
	getSubscriptionData,
} from "@/utils/subscription-plans";
import {
	initializeSubscription,
	createTransaction,
} from "@/services/subscription";

function CheckoutContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useAuth();

	const [isProcessing, setIsProcessing] = useState(false);
	const [errors, setErrors] = useState({});

	// Get plan details from URL params
	const type = searchParams.get("type");
	const frequency = searchParams.get("frequency");
	const returnUrl = searchParams.get("returnUrl");

	const planData =
		type && frequency
			? SUBSCRIPTION_PLANS[type.toUpperCase()]?.[frequency.toLowerCase()]
			: null;

	useEffect(() => {
		if (!type || !frequency || !planData) {
			router.push("/pricing");
			toast.error("Invalid subscription plan");
			return;
		}
	}, [type, frequency, planData, router]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsProcessing(true);
		setErrors({});
		try {
			const response = await fetch("/api/user/subscription", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planType: type }),
			});
			if (!response.ok) {
				const error = await response.text();
				throw new Error(error || "Failed to create checkout session");
			}
			const data = await response.json();
			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error("No checkout URL returned");
			}
		} catch (error) {
			logger.error("Checkout error:", error);
			toast.error(error.message || "Checkout failed");
		} finally {
			setIsProcessing(false);
		}
	};

	if (!user || !planData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="container max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push("/pricing")}
						className="mb-4"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Pricing
					</Button>
					<h1 className="text-3xl font-bold">
						Complete Your Purchase
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						Secure payment powered by Polar
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Payment Form */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Payment Details
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* No card fields, just a button */}
								<Alert>
									<Shield className="h-4 w-4" />
									<AlertDescription>
										You will be redirected to a secure Polar checkout page to complete your payment.
									</AlertDescription>
								</Alert>
								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={isProcessing}
								>
									{isProcessing ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Redirecting to Polar...
										</>
									) : (
										<>
											<Lock className="h-4 w-4 mr-2" />
											Pay ${planData.price}
										</>
									)}
								</Button>
							</form>
						</CardContent>
					</Card>

					{/* Order Summary */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between items-center">
									<div>
										<h3 className="font-medium">
											{type} Plan
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{frequency.charAt(0).toUpperCase() +
												frequency.slice(1)}{" "}
											billing
										</p>
									</div>
									<Badge variant="outline">{type}</Badge>
								</div>

								<Separator />

								<div className="space-y-2">
									<h4 className="font-medium">
										What&apos;s included:
									</h4>
									<ul className="space-y-1">
										{planData.features.map(
											(feature, index) => (
												<li
													key={index}
													className="flex items-center text-sm"
												>
													<CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
													{feature}
												</li>
											)
										)}
									</ul>
								</div>

								<Separator />

								<div className="flex justify-between items-center text-lg font-semibold">
									<span>Total</span>
									<span>${planData.price}</span>
								</div>

								{/* Customer Info */}
								<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
									<h4 className="font-medium mb-2">
										Customer Information
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{user.email}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Security Badges */}
						<div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
							<div className="flex items-center gap-1">
								<Shield className="h-4 w-4" />
								SSL Secured
							</div>
							<div className="flex items-center gap-1">
								<Lock className="h-4 w-4" />
								PCI Compliant
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function CheckoutPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			}
		>
			<CheckoutContent />
		</Suspense>
	);
}
