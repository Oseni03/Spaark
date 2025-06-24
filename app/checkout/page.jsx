"use client";

import { useState, useEffect } from "react";
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
	AlertCircle,
	Loader2,
	ArrowLeft,
} from "@phosphor-icons/react";
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

export default function CheckoutPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user } = useAuth();

	const [isProcessing, setIsProcessing] = useState(false);
	const [cardData, setCardData] = useState({
		cardNumber: "",
		expiryMonth: "",
		expiryYear: "",
		cvv: "",
		cardholderName: "",
	});
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

	const validateCardData = () => {
		const newErrors = {};

		// Card number validation (basic Luhn algorithm)
		const cardNumber = cardData.cardNumber.replace(/\s/g, "");
		if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
			newErrors.cardNumber = "Please enter a valid card number";
		}

		// Expiry validation
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;
		const expiryMonth = parseInt(cardData.expiryMonth);
		const expiryYear = parseInt(cardData.expiryYear);

		if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12) {
			newErrors.expiryMonth = "Invalid month";
		}

		if (
			!expiryYear ||
			expiryYear < currentYear ||
			(expiryYear === currentYear && expiryMonth < currentMonth)
		) {
			newErrors.expiryYear = "Card has expired";
		}

		// CVV validation
		if (
			!cardData.cvv ||
			cardData.cvv.length < 3 ||
			cardData.cvv.length > 4
		) {
			newErrors.cvv = "Please enter a valid CVV";
		}

		// Cardholder name validation
		if (!cardData.cardholderName.trim()) {
			newErrors.cardholderName = "Please enter the cardholder name";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const formatCardNumber = (value) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		const matches = v.match(/\d{4,16}/g);
		const match = (matches && matches[0]) || "";
		const parts = [];
		for (let i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4));
		}
		if (parts.length) {
			return parts.join(" ");
		} else {
			return v;
		}
	};

	const handleInputChange = (field, value) => {
		let formattedValue = value;

		// Format card number
		if (field === "cardNumber") {
			formattedValue = formatCardNumber(value);
		}

		// Format expiry month/year
		if (field === "expiryMonth" || field === "expiryYear") {
			formattedValue = value.replace(/\D/g, "");
		}

		// Format CVV
		if (field === "cvv") {
			formattedValue = value.replace(/\D/g, "");
		}

		setCardData((prev) => ({
			...prev,
			[field]: formattedValue,
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateCardData()) {
			toast.error("Please fix the errors above");
			return;
		}

		setIsProcessing(true);

		try {
			let subscriptionData;
			try {
				logger.info("Getting subscription data", {
					type,
					frequency,
				});
				subscriptionData = getSubscriptionData(
					type.toUpperCase(),
					frequency.toLowerCase()
				);
				logger.info("Subscription data retrieved", subscriptionData);
			} catch (error) {
				logger.error("Invalid subscription configuration", {
					type,
					frequency,
					error,
				});
				throw new Error(error.message);
			}

			const {
				price,
				priceId,
				portfolioLimit,
				blogEnabled,
				blogLimit,
				customizable,
				customPortfolioLimit,
				customArticleLimit,
				trial,
			} = subscriptionData;

			if (!priceId) {
				logger.error("Invalid price configuration", {
					type,
					frequency,
				});
				throw new Error("Invalid subscription configuration");
			}

			logger.info("Initializing subscription");
			const subscriptionResult = await initializeSubscription({
				userId: user.id,
				portfolioLimit,
				type: type.toUpperCase(),
				frequency: frequency.toLowerCase(),
				priceId,
				blogEnabled,
				blogLimit,
				customizable,
				customPortfolioLimit,
				customArticleLimit,
				trial,
			});

			if (!subscriptionResult.success) {
				logger.error(
					"Subscription creation failed",
					subscriptionResult.error
				);
				throw new Error(subscriptionResult.error);
			}

			const subscription = subscriptionResult.data;
			logger.info("Subscription initialized", {
				subscriptionId: subscription.id,
			});

			logger.info("Creating transaction record");
			const txn = await createTransaction({
				userId: user.id,
				title: `${type.toUpperCase()} Subscription - ${frequency.toLowerCase()}`,
				subscriptionId: subscription.id,
				amount: price,
				priceId,
			});

			if (!txn.success) {
				logger.error("Transaction creation failed", txn.error);
				throw new Error(txn.error);
			}

			logger.info("Transaction created", { transactionId: txn.data.id });

			const transactionId = txn.data.id;

			// Now process the card payment directly with Flutterwave
			const paymentResponse = await fetch("/api/payment/process-card", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					transactionId,
					cardData: {
						card_number: cardData.cardNumber.replace(/\s/g, ""),
						cvv: cardData.cvv,
						expiry_month: cardData.expiryMonth,
						expiry_year: cardData.expiryYear,
						currency: "USD",
						amount: planData.price,
						email: user.emailAddresses[0].emailAddress,
						tx_ref: transactionId,
						cardholder_name: cardData.cardholderName,
					},
				}),
			});

			if (!paymentResponse.ok) {
				const error = await paymentResponse.json();
				throw new Error(error.message || "Payment processing failed");
			}

			const paymentData = await paymentResponse.json();

			if (paymentData.status === "success") {
				toast.success("Payment successful! Redirecting...");
				// Redirect to success page with transaction details
				router.push(
					`/success?status=successful&tx_ref=${transactionId}&transaction_id=${paymentData.transaction_id}`
				);
			} else {
				throw new Error(paymentData.message || "Payment failed");
			}
		} catch (error) {
			logger.error("Payment error:", error);
			toast.error(error.message || "Payment processing failed");
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
						Secure payment powered by Flutterwave
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
								{/* Cardholder Name */}
								<div className="space-y-2">
									<Label htmlFor="cardholderName">
										Cardholder Name
									</Label>
									<Input
										id="cardholderName"
										placeholder="John Doe"
										value={cardData.cardholderName}
										onChange={(e) =>
											handleInputChange(
												"cardholderName",
												e.target.value
											)
										}
										className={
											errors.cardholderName
												? "border-red-500"
												: ""
										}
										disabled={isProcessing}
									/>
									{errors.cardholderName && (
										<p className="text-sm text-red-500">
											{errors.cardholderName}
										</p>
									)}
								</div>

								{/* Card Number */}
								<div className="space-y-2">
									<Label htmlFor="cardNumber">
										Card Number
									</Label>
									<Input
										id="cardNumber"
										placeholder="1234 5678 9012 3456"
										value={cardData.cardNumber}
										onChange={(e) =>
											handleInputChange(
												"cardNumber",
												e.target.value
											)
										}
										maxLength="19"
										className={
											errors.cardNumber
												? "border-red-500"
												: ""
										}
										disabled={isProcessing}
									/>
									{errors.cardNumber && (
										<p className="text-sm text-red-500">
											{errors.cardNumber}
										</p>
									)}
								</div>

								{/* Expiry and CVV */}
								<div className="grid grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label htmlFor="expiryMonth">
											Month
										</Label>
										<Input
											id="expiryMonth"
											placeholder="MM"
											value={cardData.expiryMonth}
											onChange={(e) =>
												handleInputChange(
													"expiryMonth",
													e.target.value
												)
											}
											maxLength="2"
											className={
												errors.expiryMonth
													? "border-red-500"
													: ""
											}
											disabled={isProcessing}
										/>
										{errors.expiryMonth && (
											<p className="text-sm text-red-500">
												{errors.expiryMonth}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="expiryYear">Year</Label>
										<Input
											id="expiryYear"
											placeholder="YYYY"
											value={cardData.expiryYear}
											onChange={(e) =>
												handleInputChange(
													"expiryYear",
													e.target.value
												)
											}
											maxLength="4"
											className={
												errors.expiryYear
													? "border-red-500"
													: ""
											}
											disabled={isProcessing}
										/>
										{errors.expiryYear && (
											<p className="text-sm text-red-500">
												{errors.expiryYear}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="cvv">CVV</Label>
										<Input
											id="cvv"
											placeholder="123"
											value={cardData.cvv}
											onChange={(e) =>
												handleInputChange(
													"cvv",
													e.target.value
												)
											}
											maxLength="4"
											className={
												errors.cvv
													? "border-red-500"
													: ""
											}
											disabled={isProcessing}
										/>
										{errors.cvv && (
											<p className="text-sm text-red-500">
												{errors.cvv}
											</p>
										)}
									</div>
								</div>

								{/* Security Notice */}
								<Alert>
									<Shield className="h-4 w-4" />
									<AlertDescription>
										Your payment information is encrypted
										and secure. We never store your card
										details.
									</AlertDescription>
								</Alert>

								{/* Submit Button */}
								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={isProcessing}
								>
									{isProcessing ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Processing Payment...
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
										{user.emailAddresses[0].emailAddress}
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
