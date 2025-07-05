"use client";

import { MoveRight, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import Image from "next/image";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { useEffect, useState } from "react";

export const HeroSection = () => {
	const freePlan = SUBSCRIPTION_PLANS.FREE.monthly;
	const basicPlan = SUBSCRIPTION_PLANS.BASIC.monthly;
	const proPlan = SUBSCRIPTION_PLANS.PRO.monthly;

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger animation immediately for hero section
		setIsVisible(true);
	}, []);

	return (
		<div className="w-full relative overflow-hidden">
			{/* Background Animation Elements */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-ping"></div>
				<div className="absolute top-40 right-20 w-3 h-3 bg-blue-500/20 rounded-full animate-pulse"></div>
				<div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-500/20 rounded-full animate-bounce"></div>
				<div className="absolute bottom-20 right-10 w-3 h-3 bg-green-500/20 rounded-full animate-ping"></div>
				<div className="absolute top-1/2 left-1/4 w-1 h-1 bg-yellow-500/30 rounded-full animate-pulse"></div>
				<div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-500/20 rounded-full animate-bounce"></div>
			</div>

			<div className="container mx-auto relative z-10">
				<div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
					<div
						className={`transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{ transitionDelay: "200ms" }}
					>
						<Link href="https://medium.com/@Oseni03/unveiling-the-ultimate-developer-portfolio-builder-powered-by-magicui-spaark-743f6e6ef7b4">
							<Button
								variant="secondary"
								size="sm"
								className="gap-4 hover:scale-105 transition-transform duration-300 hover:shadow-lg"
							>
								<Sparkles className="w-4 h-4 animate-pulse" />
								Read our launch article{" "}
								<MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</Button>
						</Link>
					</div>

					<div
						className={`flex gap-4 flex-col transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{ transitionDelay: "400ms" }}
					>
						<h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-regular animate-pulse">
							{siteConfig.heroIntro}
						</h1>
						<p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-3xl text-center">
							{siteConfig.description} Start with our{" "}
							<span className="font-semibold text-primary">
								free plan
							</span>{" "}
							or unlock advanced features with our premium tiers.
						</p>
					</div>

					{/* Quick Plan Preview */}
					<div
						className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8 transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{ transitionDelay: "600ms" }}
					>
						<div className="flex items-center justify-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-lg group">
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
									<span className="font-semibold group-hover:text-green-600 transition-colors duration-300">
										Free
									</span>
								</div>
								<p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
									{freePlan.portfolioLimit} portfolio •{" "}
									{freePlan.features.length} features
								</p>
							</div>
						</div>
						<div className="flex items-center justify-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-lg group">
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Zap className="w-4 h-4 text-blue-500 animate-pulse" />
									<span className="font-semibold group-hover:text-blue-600 transition-colors duration-300">
										Basic
									</span>
								</div>
								<p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
									${basicPlan.price}/mo • Blog enabled
								</p>
							</div>
						</div>
						<div className="flex items-center justify-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-lg group">
							<div className="text-center">
								<div className="flex items-center justify-center gap-2 mb-2">
									<Crown className="w-4 h-4 text-purple-500 animate-pulse" />
									<span className="font-semibold group-hover:text-purple-600 transition-colors duration-300">
										Pro
									</span>
								</div>
								<p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
									${proPlan.price}/mo •{" "}
									{proPlan.portfolioLimit} portfolios
								</p>
							</div>
						</div>
					</div>

					<div
						className={`grid grid-cols-1 md:grid-flow-col gap-3 w-full max-w-md transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{ transitionDelay: "800ms" }}
					>
						<Link href={"/sign-up"} className="w-full">
							<Button
								size="lg"
								className="w-full gap-4 hover:scale-105 transition-transform duration-300 hover:shadow-lg"
							>
								Start Free{" "}
								<MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</Button>
						</Link>
						<Link href={siteConfig.github} className="w-full">
							<Button
								size="lg"
								className="w-full gap-4 hover:scale-105 transition-transform duration-300 hover:shadow-lg"
								variant="outline"
							>
								Star on GitHub{" "}
								<Image
									src="/github.svg"
									alt="GitHub"
									width={16}
									height={16}
									className="group-hover:rotate-12 transition-transform duration-300"
								/>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
