"use client";

import { siteConfig } from "@/config/site";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export const Features = () => {
	const freePlan = SUBSCRIPTION_PLANS.FREE.monthly;
	const basicPlan = SUBSCRIPTION_PLANS.BASIC.monthly;
	const proPlan = SUBSCRIPTION_PLANS.PRO.monthly;

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		const element = document.getElementById("features");
		if (element) {
			observer.observe(element);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section
			id="features"
			className="container mx-auto px-6 py-20 max-w-7xl"
		>
			{/* Header Section */}
			<div
				className={`text-center mb-20 transition-all duration-1000 ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}
			>
				<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent animate-pulse">
					Everything you need to build your portfolio
				</h2>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
					From stunning templates to advanced features, we&apos;ve got
					you covered at every level
				</p>
			</div>

			{/* Core Features Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
				{siteConfig.features.map((feature, index) => (
					<Card
						key={feature.id}
						className={`group hover:shadow-lg transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20 hover:from-background hover:to-muted/40 transform hover:-translate-y-2 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{
							transitionDelay: `${index * 200}ms`,
							animation: isVisible
								? `slideInUp 0.6s ease-out ${index * 0.1}s both`
								: "none",
						}}
					>
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
								{feature.icon && (
									<feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
								)}
							</div>
							<h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
								{feature.name}
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed mb-4 group-hover:text-foreground transition-colors duration-300">
								{feature.description}
							</p>
							<div className="flex gap-1 flex-wrap justify-center">
								<Badge
									variant="outline"
									className="text-xs bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:scale-105 transition-transform duration-200"
								>
									Free
								</Badge>
								<Badge
									variant="outline"
									className="text-xs bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:scale-105 transition-transform duration-200"
								>
									Basic
								</Badge>
								<Badge
									variant="outline"
									className="text-xs bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:scale-105 transition-transform duration-200"
								>
									Pro
								</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Floating Animation Elements */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-ping"></div>
				<div className="absolute top-40 right-20 w-3 h-3 bg-blue-500/20 rounded-full animate-pulse"></div>
				<div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-500/20 rounded-full animate-bounce"></div>
				<div className="absolute bottom-20 right-10 w-3 h-3 bg-green-500/20 rounded-full animate-ping"></div>
			</div>

			<style jsx>{`
				@keyframes slideInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</section>
	);
};
