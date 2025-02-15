"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "../ui/Spinner";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/utils";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";

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
	type,
	billing,
	features,
	prices,
	isHovered,
	onMouseEnter,
	onMouseLeave,
	onBillingChange,
	onSubscribe,
	processing,
}) => {
	return (
		<Card
			className={`relative transition-all duration-300 ${
				isHovered ? "transform -translate-y-2 shadow-xl" : ""
			}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<CardHeader>
				<CardTitle>{type}</CardTitle>
				<p className="text-sm text-gray-500">
					{type === "Individual"
						? "Perfect for freelancers and solo developers"
						: "For organizations and development teams"}
				</p>
			</CardHeader>
			<CardContent>
				{/* Billing toggle */}
				<div className="flex bg-gray-100 dark:text-gray-900 rounded-lg p-1 mb-6">
					{Object.keys(prices).map((period) => (
						<button
							key={period}
							className={`flex-1 py-2 rounded-md text-sm transition-all duration-300 ${
								billing === period
									? "bg-white shadow-sm transform scale-105"
									: "hover:bg-gray-200"
							}`}
							onClick={() => onBillingChange(period)}
						>
							{period.charAt(0).toUpperCase() + period.slice(1)}
						</button>
					))}
				</div>

				{/* Price display */}
				<div className="mb-8 text-center">
					<div className="flex items-baseline justify-center">
						<span className="text-4xl font-bold">
							${prices[billing].price}
						</span>
						<span className="text-gray-500 ml-2">
							/{prices[billing].interval}
						</span>
					</div>
					{billing === "yearly" && (
						<span className="text-green-600 text-sm mt-1">
							Save 20% with annual billing
						</span>
					)}
				</div>

				{/* Features list */}
				<ul className="space-y-4">
					{features.map((feature, index) => (
						<li
							key={feature}
							className="flex items-center transform transition-all duration-300 hover:translate-x-2"
							style={{ transitionDelay: `${index * 50}ms` }}
						>
							<Check className="h-5 w-5 text-green-500 mr-2" />
							<span>{feature}</span>
						</li>
					))}
				</ul>

				<Button
					size="lg"
					className="w-full mt-8"
					onClick={() => onSubscribe(type, billing)}
					variant="default"
					disabled={processing}
				>
					{processing && <Spinner />}
					Get Started
				</Button>
			</CardContent>
		</Card>
	);
};

export default function Pricing({
	isDialog = false,
	returnUrl = process.env.NEXT_PUBLIC_APP_URL,
}) {
	const router = useRouter();
	const { user } = useUser();
	const { organization } = useOrganization();
	const [isProcessing, setIsProcessing] = useState(false);
	const [individualBilling, setIndividualBilling] = useState("monthly");
	const [teamBilling, setTeamBilling] = useState("monthly");
	const [isHoveredIndividual, setIsHoveredIndividual] = useState(false);
	const [isHoveredTeam, setIsHoveredTeam] = useState(false);

	const handleCheckout = async (type, billing) => {
		if (isProcessing || !user) {
			logger.info("Checkout blocked", { isProcessing, hasUser: !!user });
			router.push("/sign-in");
			toast("Sign in to subscribe!");
			return;
		}

		if (organization && !(type.toUpperCase() === "TEAM")) {
			toast.error(
				"Organization account can only subscribe to TEAM plan."
			);
			return;
		}

		if (!organization && !(type.toUpperCase() === "INDIVIDUAL")) {
			toast.error(
				"Individual account can only subscribe to INDIVIDUAL plan."
			);
			return;
		}

		setIsProcessing(true);
		logger.info("Starting checkout process", {
			type,
			billing,
			userId: user.id,
		});

		try {
			const response = await axios.post("/api/payment/checkout", {
				type: type.toUpperCase(),
				frequency: billing.toUpperCase(),
				userId: user.id,
				userEmail: user.emailAddresses[0].emailAddress,
				username: user.username || user.fullName,
				returnUrl, // Add returnUrl to the payload
				orgId: organization?.id,
			});

			logger.info("Checkout response received", {
				hasLink: !!response.data.link,
			});

			if (response.data.link) {
				window.location.href = response.data.link;
				return;
			}

			logger.error("No payment link received");
			toast.error("Unable to initiate checkout");
		} catch (err) {
			logger.error("Checkout error:", {
				message: err.message,
				response: err.response?.data,
				stack: err.stack,
			});
			toast.error(err.response?.data?.message || "Checkout failed");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className={`${isDialog ? "" : "container"}`}>
			<PricingHeader
				title="Choose Your Plan"
				subtitle="Build your professional portfolio with our flexible pricing options"
			/>

			<div
				className={`grid md:grid-cols-2 gap-8 ${isDialog ? "max-w-4xl" : "max-w-6xl"} mx-auto`}
			>
				<PricingCard
					type="Individual"
					billing={individualBilling}
					prices={SUBSCRIPTION_PLANS.INDIVIDUAL}
					features={
						SUBSCRIPTION_PLANS.INDIVIDUAL[individualBilling]
							.features
					}
					isHovered={isHoveredIndividual}
					onMouseEnter={() => setIsHoveredIndividual(true)}
					onMouseLeave={() => setIsHoveredIndividual(false)}
					onBillingChange={setIndividualBilling}
					onSubscribe={handleCheckout}
					processing={isProcessing}
				/>

				<PricingCard
					type="Team"
					billing={teamBilling}
					prices={SUBSCRIPTION_PLANS.TEAM}
					features={SUBSCRIPTION_PLANS.TEAM[teamBilling].features}
					isHovered={isHoveredTeam}
					onMouseEnter={() => setIsHoveredTeam(true)}
					onMouseLeave={() => setIsHoveredTeam(false)}
					onBillingChange={setTeamBilling}
					onSubscribe={handleCheckout}
					processing={isProcessing}
				/>
			</div>
		</div>
	);
}
