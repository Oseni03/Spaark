"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Spinner } from "../ui/Spinner";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/utils";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import { getUserIdFromSession } from "@/lib/auth-utils";
import { authClient } from "@/lib/auth-client";

const PricingHeader = ({ title, subtitle, isVisible }) => (
	<section
		className={`text-center mb-16 transition-all duration-1000 ${
			isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
		}`}
	>
		<h1
			className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900 animate-pulse`}
		>
			{title}
		</h1>
		<p className="text-gray-600 dark:text-gray-400 pt-1 max-w-2xl mx-auto">
			{subtitle}
		</p>
	</section>
);

const PlanIcon = ({ type }) => {
	switch (type) {
		case "FREE":
			return (
				<Sparkles className="w-5 h-5 text-green-500 animate-pulse" />
			);
		case "BASIC":
			return <Zap className="w-5 h-5 text-blue-500 animate-pulse" />;
		case "PRO":
			return <Crown className="w-5 h-5 text-purple-500 animate-pulse" />;
		default:
			return <Sparkles className="w-5 h-5" />;
	}
};

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
	isPopular = false,
	isVisible,
	index,
}) => {
	const price = useMemo(() => {
		return prices[billing].price;
	}, [billing, prices]);

	const handleSubscribe = useCallback(() => {
		onSubscribe(price.priceId, price.slug);
	}, [price, onSubscribe]);

	const getPlanColor = (type) => {
		switch (type) {
			case "FREE":
				return "border-green-200 dark:border-green-800";
			case "BASIC":
				return "border-blue-200 dark:border-blue-800";
			case "PRO":
				return "border-purple-200 dark:border-purple-800";
			default:
				return "border-gray-200 dark:border-gray-800";
		}
	};

	const getPriceColor = (type) => {
		switch (type) {
			case "FREE":
				return "text-green-600";
			case "BASIC":
				return "text-blue-600";
			case "PRO":
				return "text-purple-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<Card
			className={`relative transition-all duration-500 border-2 ${getPlanColor(
				type
			)} ${
				isHovered ? "transform -translate-y-2 shadow-xl" : "shadow-md"
			} ${isPopular ? "ring-2 ring-blue-500 ring-opacity-50" : ""} hover:scale-105 ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-8"
			}`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			style={{ transitionDelay: `${index * 200}ms` }}
		>
			{isPopular && (
				<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-bounce">
					<Badge className="bg-blue-500 text-white px-3 py-1">
						Most Popular
					</Badge>
				</div>
			)}

			<CardHeader className="text-center pb-4">
				<div className="flex items-center justify-center gap-2 mb-2">
					<PlanIcon type={type} />
					<CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
						{type}
					</CardTitle>
				</div>
				<p className="text-sm text-gray-500">
					{type === "FREE" && "Perfect for getting started"}
					{type === "BASIC" && "Great for individual portfolios"}
					{type === "PRO" && "Ideal for professionals"}
				</p>
			</CardHeader>

			<CardContent>
				<div className="mb-8 text-center">
					<div className="flex items-baseline justify-center">
						<span
							className={`text-4xl font-bold ${getPriceColor(type)}`}
						>
							${prices[billing].price}
						</span>
						<span className="text-gray-500 ml-2">
							{type === "FREE" ? "" : "/month"}
						</span>
					</div>
					{type === "FREE" && (
						<p className="text-sm text-green-600 font-medium mt-1 animate-pulse">
							No credit card required
						</p>
					)}
				</div>

				<ul className="space-y-3 mb-8">
					{features.map((feature, index) => (
						<li
							key={feature}
							className="flex items-center transform transition-all duration-300 hover:translate-x-1 group"
							style={{ transitionDelay: `${index * 50}ms` }}
						>
							<Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
							<span className="text-sm group-hover:text-foreground transition-colors duration-200">
								{feature}
							</span>
						</li>
					))}
				</ul>

				<Button
					size="lg"
					className={`w-full hover:scale-105 transition-transform duration-300 ${
						type === "FREE"
							? "bg-green-600 hover:bg-green-700"
							: type === "BASIC"
								? "bg-blue-600 hover:bg-blue-700"
								: "bg-purple-600 hover:bg-purple-700"
					}`}
					onClick={handleSubscribe}
					disabled={processing}
				>
					{processing && <Spinner />}
					{type === "FREE" ? "Start For Free" : "Get Started"}
				</Button>
			</CardContent>
		</Card>
	);
};

export default function Pricing() {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [hoveredStates, setHoveredStates] = useState({});
	const [isVisible, setIsVisible] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const userId = await getUserIdFromSession();
				if (userId) setIsAuthenticated(true);
			} catch {
				setIsAuthenticated(false);
			}
		};
		checkAuth();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		const element = document.getElementById("pricing");
		if (element) {
			observer.observe(element);
		}

		return () => observer.disconnect();
	}, []);

	const setHovered = useCallback((type) => {
		setHoveredStates((prev) => ({ ...prev, [type]: !prev[type] }));
	}, []);

	const handleCheckout = useCallback(
		async (productId, slug) => {
			if (isAuthenticated === false) {
				router.push("/sign-in");
				return;
			}
			setIsProcessing(true);

			try {
				await authClient.checkout({
					products: [productId],
					slug: slug,
				});
			} catch (error) {
				logger.error("Checkout failed:", error);
				// TODO: Add user-facing error notification
				toast.error("Oops, something went wrong");
			} finally {
				setIsProcessing(false);
			}
		},
		[router, isAuthenticated]
	);

	const planTypes = ["FREE", "BASIC", "PRO"];

	return (
		<div className={`container relative overflow-hidden`}>
			{/* Background Animation Elements */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-ping"></div>
				<div className="absolute top-40 right-20 w-3 h-3 bg-blue-500/20 rounded-full animate-pulse"></div>
				<div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-500/20 rounded-full animate-bounce"></div>
				<div className="absolute bottom-20 right-10 w-3 h-3 bg-green-500/20 rounded-full animate-ping"></div>
			</div>

			<PricingHeader
				title="Simple, Transparent Pricing"
				subtitle="Choose the perfect plan for your portfolio needs. Start free and upgrade anytime."
				isVisible={isVisible}
			/>

			<div
				className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10`}
			>
				{planTypes.map((type, index) => (
					<PricingCard
						key={type}
						type={type}
						billing="monthly"
						prices={SUBSCRIPTION_PLANS[type]}
						features={SUBSCRIPTION_PLANS[type].monthly.features}
						isHovered={hoveredStates[type]}
						onMouseEnter={() => setHovered(type)}
						onMouseLeave={() => setHovered(null)}
						onSubscribe={handleCheckout}
						processing={isProcessing}
						isPopular={type === "BASIC"}
						isVisible={isVisible}
						index={index}
					/>
				))}
			</div>
		</div>
	);
}
