"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import { useRouter } from "next/navigation";
import axios from "axios";

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

const PricingCard = ({
	user,
	handleCheckout,
	title,
	priceId,
	monthlyPrice,
	description,
	features,
	actionLabel,
	popular,
	exclusive,
	custom_message,
}) => {
	const router = useRouter();
	return (
		<Card
			className={cn(
				`w-72 flex flex-col justify-between py-1 ${
					popular ? "border-rose-400" : "border-zinc-700"
				} mx-auto sm:mx-0`,
				{
					"animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
						exclusive,
				}
			)}
		>
			<div>
				<CardHeader className="pb-8 pt-4">
					<div className="flex justify-between">
						<CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
							{title}
						</CardTitle>
					</div>
					<div className="flex gap-0.5">
						<h2 className="text-3xl font-bold">
							{monthlyPrice ? "$" + monthlyPrice : "Custom"}
						</h2>
						<span className="flex flex-col justify-end text-sm mb-1">
							{monthlyPrice ? "/month" : null}
						</span>
					</div>
					<CardDescription className="pt-1.5 h-12">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{features.map((feature) => (
						<CheckItem key={feature} text={feature} />
					))}
				</CardContent>
			</div>
			<CardFooter className="grid space-y-2 mt-2">
				{custom_message && (
					<div
						className={cn(
							"px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white",
							{
								"bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ":
									popular,
							}
						)}
					>
						{custom_message}
					</div>
				)}

				<Button
					onClick={() => {
						if (user?.id) {
							handleCheckout(priceId, title, monthlyPrice);
						} else {
							toast("Please login or sign up to purchase", {
								description:
									"You must be logged in to make a purchase",
								action: {
									label: "Sign Up",
									onClick: () => {
										router.push("/sign-up");
									},
								},
							});
						}
					}}
					className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
					type="button"
				>
					<div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b fr om-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
					{actionLabel}
				</Button>
			</CardFooter>
		</Card>
	);
};

const CheckItem = ({ text }) => (
	<div className="flex gap-2">
		<CheckCircle2 size={18} className="my-auto text-green-400" />
		<p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">
			{text}
		</p>
	</div>
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

	const plans = [
		{
			title: "Essential Dev",
			monthlyPrice: 5,
			description:
				"Perfect for beginners or developers looking to create a simple, professional portfolio with essential features.",
			features: [
				"Mobile-Responsive Design",
				"Unlimited Project Display",
				"Basic shareable link",
				"Contact Form with Email Notifications",
			],
			priceId: process.env.NEXT_PUBLIC_ESSENTIAL_PRICE_ID,
			actionLabel: "Start trial",
		},
		{
			title: "Pro Dev Suite (Coming Soon)",
			monthlyPrice: 10,
			description:
				"Unlock premium features with early access at a discounted price.",
			features: [
				"All 'Essential Dev' Features",
				"Custom Domain Integration",
				"Blog Integration",
				"Priority Customer Support",
			],
			actionLabel: "Subscribe Now",
			priceId: process.env.NEXT_PUBLIC_PRO_PRICE_ID,
			popular: true,
			custom_message:
				"💲Early Access Price: $7/month (Regular price: $10/month)",
		},
	];

	return (
		<div>
			<PricingHeader
				title="Sample Pricing Plans"
				subtitle="Choose a plan to ensure "
			/>
			<section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
				{plans.map((plan) => {
					return (
						<PricingCard
							user={user}
							handleCheckout={handleCheckout}
							key={plan.title}
							{...plan}
						/>
					);
				})}
			</section>
		</div>
	);
}
