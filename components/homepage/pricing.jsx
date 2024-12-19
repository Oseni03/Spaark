"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import axios from "axios";
import { Spinner } from "../ui/Spinner";
import { siteConfig } from "@/config/site";

const PricingHeader = ({ title, subtitle }) => (
	<section className="text-center">
		<h1
			className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
		>
			{title}
		</h1>
		<p className="text-gray-600 dark:text-gray-400 pt-1">{subtitle}</p>
		<br />
	</section>
);

export default function Pricing() {
	const { user } = useUser();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleCheckout = async (priceId, title, amount) => {
		// Prevent multiple simultaneous checkout attempts
		if (isProcessing) return;

		// Validate user
		if (!user?.emailAddresses[0]?.emailAddress) {
			toast.error("Please log in to proceed with checkout");
			return;
		}

		setIsProcessing(true);

		try {
			// Make the checkout request
			const response = await axios.post("/api/checkout", {
				userId: user.id,
				priceId,
				title,
				amount,
				userEmail: user.emailAddresses[0].emailAddress,
				username: user.username || user.fullName,
			});

			// Redirect to payment link
			if (response.data.link) {
				window.location.href = response.data.link;
				return;
			}

			// Fallback error handling
			toast.error("Unable to initiate checkout");
		} catch (err) {
			// Error handling
			if (axios.isAxiosError(err)) {
				toast.error(
					err.response?.data?.message ||
						"An error occurred during checkout"
				);
			} else {
				toast.error("Unexpected error. Please try again.");
			}
			console.error("Checkout error:", err);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="container">
			<PricingHeader
				title="Pricing That Works for You"
				subtitle={`Choose a plan that fits your needs and budget. Whether you're just starting or ready to unlock premium features, ${siteConfig.name} has a plan to help you shine.`}
			/>
			<section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
				<div className="flex flex-col md:flex-row gap-6 justify-center items-center py-12 px-4">
					{/* Standard Plan Card */}
					<div className="w-full max-w-md border border-gray-200 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
						<div className="mb-6">
							<h2 className="text-2xl font-bold mb-2">
								Essential Dev
							</h2>
							<div className="flex items-baseline">
								<span className="text-4xl font-extrabold mr-2">
									$5
								</span>
								<span>/month</span>
							</div>
							<p className="mt-4">
								Perfect for beginners or developers looking to
								create a simple, professional portfolio with
								essential features.
							</p>
						</div>

						<ul className="mb-6 space-y-4">
							{[
								"Mobile-Responsive Design",
								"Unlimited Project Display",
								"Basic shareable link",
								"Contact Form with Email Notifications",
							].map((feature, index) => (
								<li
									key={index}
									className="flex items-center space-x-3"
								>
									<svg
										className="h-5 w-5 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>{feature}</span>
								</li>
							))}
						</ul>

						<Button
							size="lg"
							disabled={isProcessing}
							className="w-full dark:bg-white py-3 rounded-lg dark:hover:bg-gray-700 transition-colors font-semibold"
							onClick={() => {
								if (user?.id) {
									handleCheckout(
										process.env
											.NEXT_PUBLIC_ESSENTIAL_PRICE_ID,
										"Essential Dev",
										5
									);
								} else {
									toast(
										"Please login or sign up to purchase",
										{
											description:
												"You must be logged in to make a purchase",
											action: {
												label: "Sign Up",
												onClick: () => {
													router.push("/sign-up");
												},
											},
										}
									);
								}
							}}
						>
							{isProcessing && <Spinner />}
							Subscribe Now
						</Button>
					</div>

					{/* Discounted Plan Card */}
					<div className="w-full max-w-md bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl shadow-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:scale-105">
						<div className="absolute top-0 right-0 m-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
							30% OFF
						</div>

						<div className="mb-6">
							<h2 className="text-2xl font-bold mb-2">
								Coming Soon: Pro Dev Suite
							</h2>
							<div className="flex items-baseline">
								<span className="text-4xl font-extrabold mr-2 line-through opacity-50">
									$60
								</span>
								<span className="text-4xl font-extrabold text-white mr-2">
									$42
								</span>
								<span className="text-gray-200">/6 months</span>
							</div>
							<p className="mt-4 text-white/80">
								Pre-order our upcoming pro features and save big
								on our most comprehensive plan.
							</p>
						</div>

						<ul className="mb-6 space-y-4">
							{[
								"All 'Essential Dev' Features",
								"Custom Domain Integration",
								"Blog Integration",
								"Priority Customer Support",
							].map((feature, index) => (
								<li
									key={index}
									className="flex items-center space-x-3"
								>
									<svg
										className="h-5 w-5 text-green-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>{feature}</span>
								</li>
							))}
						</ul>

						<Button
							size="lg"
							disabled={isProcessing}
							className="w-full bg-white text-purple-700 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
							onClick={() => {
								if (user?.id) {
									handleCheckout(
										process.env.NEXT_PUBLIC_PRO_PRICE_ID,
										"Pro Dev Suite",
										42
									);
								} else {
									toast(
										"Please login or sign up to purchase",
										{
											description:
												"You must be logged in to make a purchase",
											action: {
												label: "Sign Up",
												onClick: () => {
													router.push("/sign-up");
												},
											},
										}
									);
								}
							}}
						>
							{isProcessing && <Spinner />}
							Pre-order Now
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
