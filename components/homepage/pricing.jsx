"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "../ui/Spinner";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/utils";
import {
	calculateCustomPrice,
	validatePlanLimits,
} from "@/utils/subscription-plans";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import { useAuth } from "@/context/auth-context";

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
	onSubscribe,
	processing,
}) => {
	const [customConfig, setCustomConfig] = useState({
		portfolios: 5,
		articles: 20,
	});

	const price = useMemo(() => {
		if (type !== "Custom") return prices[billing].price;
		return calculateCustomPrice(
			prices[billing].basePrice,
			customConfig.portfolios,
			customConfig.articles,
			prices[billing].pricePerPortfolio,
			prices[billing].pricePerArticle
		);
	}, [type, billing, prices, customConfig]);

	const handleCustomConfigChange = useCallback((key, value) => {
		setCustomConfig((prev) => ({ ...prev, [key]: Number(value) }));
	}, []);

	const handleSubscribe = useCallback(() => {
		if (
			!validatePlanLimits(
				type,
				customConfig.portfolios,
				customConfig.articles
			)
		) {
			toast.error("Invalid plan configuration");
			return;
		}
		onSubscribe(type, billing, customConfig);
	}, [type, billing, customConfig, onSubscribe]);

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
					{type === "Basic" && "Perfect for individual portfolios"}
					{type === "Pro" && "Ideal for professionals"}
					{type === "Custom" && "Tailored to your needs"}
				</p>
			</CardHeader>
			<CardContent>
				<div className="mb-8 text-center">
					<div className="flex items-baseline justify-center">
						<span className="text-4xl font-bold">
							${type === "Custom" ? price : prices[billing].price}
						</span>
						<span className="text-gray-500 ml-2">/month</span>
					</div>
					{prices[billing].trial && (
						<span className="text-green-600 text-sm mt-1 block">
							{prices[billing].trial} days free trial
						</span>
					)}
				</div>

				{type === "Custom" && (
					<div className="mb-6 space-y-4">
						<div>
							<label>Portfolios: {customConfig.portfolios}</label>
							<input
								type="range"
								min="5"
								max="20"
								value={customConfig.portfolios}
								onChange={(e) =>
									handleCustomConfigChange(
										"portfolios",
										e.target.value
									)
								}
								className="w-full"
							/>
						</div>
						<div>
							<label>
								Articles/month: {customConfig.articles}
							</label>
							<input
								type="range"
								min="20"
								max="100"
								value={customConfig.articles}
								onChange={(e) =>
									handleCustomConfigChange(
										"articles",
										e.target.value
									)
								}
								className="w-full"
							/>
						</div>
					</div>
				)}

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
					onClick={handleSubscribe}
					variant="default"
					disabled={processing}
				>
					{processing && <Spinner />}
					{type === "Basic" ? "Start Free Trial" : "Get Started"}
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
	const { user } = useAuth();
	const [isProcessing, setIsProcessing] = useState(false);
	const [individualBilling, setIndividualBilling] = useState("monthly");
	const [teamBilling, setTeamBilling] = useState("monthly");
	const [isHoveredIndividual, setIsHoveredIndividual] = useState(false);
	const [isHoveredTeam, setIsHoveredTeam] = useState(false);
	const [hoveredStates, setHoveredStates] = useState({});

	const setHovered = useCallback((type) => {
		setHoveredStates((prev) => ({ ...prev, [type]: !prev[type] }));
	}, []);

	const handleCheckout = useCallback(
		async (type, billing, customConfig = {}) => {
			if (!user) {
				router.push("/sign-in");
				toast.info("Please sign in to continue");
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
					returnUrl,
					customConfig,
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
		},
		[user, router]
	);

	return (
		<div className={`${isDialog ? "" : "container"}`}>
			<PricingHeader
				title="Choose Your Plan"
				subtitle="Build your professional portfolio with our flexible pricing options"
			/>

			<div
				className={`grid md:grid-cols-3 gap-8 ${
					isDialog ? "max-w-5xl" : "max-w-7xl"
				} mx-auto`}
			>
				{["Basic", "Pro", "Custom"].map((type) => (
					<PricingCard
						key={type}
						type={type}
						billing="monthly"
						prices={SUBSCRIPTION_PLANS[type.toUpperCase()]}
						features={
							SUBSCRIPTION_PLANS[type.toUpperCase()].monthly
								.features
						}
						isHovered={hoveredStates[type]}
						onMouseEnter={() => setHovered(type)}
						onMouseLeave={() => setHovered(null)}
						onSubscribe={handleCheckout}
						processing={isProcessing}
					/>
				))}
			</div>
		</div>
	);
}
