"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";
import { Card, CardContent } from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/utils/subscription-plans";
import { useEffect, useState } from "react";

export function AccordionComponent() {
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

		const element = document.getElementById("faq-section");
		if (element) {
			observer.observe(element);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div id="faq-section" className="container mx-auto px-6 max-w-4xl">
			{/* Header */}
			<div
				className={`text-center mb-12 transition-all duration-1000 ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}
			>
				<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent animate-pulse">
					Frequently Asked Questions
				</h2>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Everything you need to know about Spaark and our
					subscription plans
				</p>
			</div>

			{/* FAQ Accordion */}
			<Card
				className={`border-0 bg-gradient-to-br from-background to-muted/20 transition-all duration-1000 hover:shadow-xl ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}
				style={{ transitionDelay: "200ms" }}
			>
				<CardContent className="p-8">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem
							value="item-1"
							className="border-b border-border/50 group"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 transition-all duration-300 group-hover:bg-muted/30 rounded-lg px-2">
								<span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
									How does Spaark work?
								</span>
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
								<p className="mb-4">
									Spaark simplifies portfolio creation into
									three easy steps:
								</p>
								<ol className="list-decimal list-inside space-y-2 ml-4">
									<li className="hover:translate-x-2 transition-transform duration-200">
										<strong>Choose a template:</strong>{" "}
										Select from our beautiful,
										mobile-responsive templates designed for
										developers and tech professionals.
									</li>
									<li className="hover:translate-x-2 transition-transform duration-200">
										<strong>Fill in your details:</strong>{" "}
										Add your projects, skills, experience,
										and personal information through our
										intuitive interface.
									</li>
									<li className="hover:translate-x-2 transition-transform duration-200">
										<strong>Go live:</strong> Your portfolio
										is instantly published and ready to
										share with the world.
									</li>
								</ol>
								<p className="mt-4 text-sm">
									All plans include our core features, with
									additional benefits like custom domains and
									blog functionality available in higher
									tiers.
								</p>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="item-2"
							className="border-b border-border/50 group"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 transition-all duration-300 group-hover:bg-muted/30 rounded-lg px-2">
								<span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
									What are the subscription plans and pricing?
								</span>
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300 hover:shadow-lg">
											<h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
												Free Plan
											</h4>
											<p className="text-2xl font-bold text-green-600 mb-2">
												$0
											</p>
											<p className="text-sm">
												Perfect for getting started with{" "}
												{freePlan.portfolioLimit}{" "}
												portfolio
											</p>
										</div>
										<div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300 hover:shadow-lg">
											<h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
												Basic Plan
											</h4>
											<p className="text-2xl font-bold text-blue-600 mb-2">
												${basicPlan.price}/mo
											</p>
											<p className="text-sm">
												Great for individual portfolios
												with blog support
											</p>
										</div>
										<div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 hover:scale-105 transition-all duration-300 hover:shadow-lg">
											<h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
												Pro Plan
											</h4>
											<p className="text-2xl font-bold text-purple-600 mb-2">
												${proPlan.price}/mo
											</p>
											<p className="text-sm">
												Ideal for professionals with
												multiple portfolios
											</p>
										</div>
									</div>
									<p className="text-sm">
										All plans include our core features.
										Start with the free plan and upgrade
										anytime as your needs grow.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="item-3"
							className="border-b border-border/50 group"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 transition-all duration-300 group-hover:bg-muted/30 rounded-lg px-2">
								<span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
									Can I use a custom domain?
								</span>
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
								<p className="mb-4">
									Yes! Custom domain support is available on
									all paid plans (Basic and Pro). You can
									easily connect your own domain to your
									Spaark portfolio.
								</p>
								<div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors duration-300">
									<h4 className="font-semibold mb-2">
										What&apos;s included:
									</h4>
									<ul className="space-y-1 text-sm">
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Easy domain connection process
										</li>
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Full SSL security
										</li>
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Fast global CDN
										</li>
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Professional email forwarding
										</li>
									</ul>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="item-4"
							className="border-b border-border/50 group"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 transition-all duration-300 group-hover:bg-muted/30 rounded-lg px-2">
								<span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
									What&apos;s the difference between Basic and
									Pro plans?
								</span>
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="hover:scale-105 transition-transform duration-300">
											<h4 className="font-semibold text-blue-600 mb-3">
												Basic Plan (${basicPlan.price}
												/mo)
											</h4>
											<ul className="space-y-2 text-sm">
												<li className="hover:translate-x-2 transition-transform duration-200">
													• {basicPlan.portfolioLimit}{" "}
													active portfolio
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• Blog enabled (
													{basicPlan.blogLimit}{" "}
													articles)
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• Custom domain support
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• All Free features included
												</li>
											</ul>
										</div>
										<div className="hover:scale-105 transition-transform duration-300">
											<h4 className="font-semibold text-purple-600 mb-3">
												Pro Plan (${proPlan.price}/mo)
											</h4>
											<ul className="space-y-2 text-sm">
												<li className="hover:translate-x-2 transition-transform duration-200">
													• {proPlan.portfolioLimit}{" "}
													active portfolios
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• Blog enabled (
													{proPlan.blogLimit}{" "}
													articles)
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• All Basic features
													included
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• Priority support
												</li>
												<li className="hover:translate-x-2 transition-transform duration-200">
													• Advanced analytics
												</li>
											</ul>
										</div>
									</div>
									<p className="text-sm bg-muted/50 p-3 rounded-lg hover:bg-muted/70 transition-colors duration-300">
										<strong>Pro tip:</strong> Most users
										start with the Basic plan and upgrade to
										Pro when they need multiple portfolios
										or want to showcase different aspects of
										their work.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="item-5"
							className="border-b border-border/50 group"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 transition-all duration-300 group-hover:bg-muted/30 rounded-lg px-2">
								<span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
									Can I switch templates later?
								</span>
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
								<p className="mb-4">
									Absolutely! You can switch between available
									templates at any time without losing your
									content. All your information will
									automatically adapt to the new template
									layout.
								</p>
								<div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors duration-300">
									<h4 className="font-semibold mb-2">
										Template switching benefits:
									</h4>
									<ul className="space-y-1 text-sm">
										<li className="hover:translate-x-2 transition-transform duration-200">
											• No content loss during template
											changes
										</li>
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Automatic content migration
										</li>
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Preview before switching
										</li>
										<li className="hover:translate-x-2 transition-transform duration-200">
											• Instant updates
										</li>
									</ul>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem
							value="item-6"
							className="border-b border-border/50 group"
						>
							<AccordionTrigger className="text-left hover:no-underline py-4 transition-all duration-300 group-hover:bg-muted/30 rounded-lg px-2">
								<span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
									What if I want to cancel my subscription?
								</span>
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
								<p className="mb-4">
									You can cancel your subscription at any
									time. When you cancel:
								</p>
								<ul className="space-y-2 mb-4">
									<li className="hover:translate-x-2 transition-transform duration-200">
										• Your portfolio remains active until
										the end of your billing period
									</li>
									<li className="hover:translate-x-2 transition-transform duration-200">
										• You&apos;ll be downgraded to the Free
										plan automatically
									</li>
									<li className="hover:translate-x-2 transition-transform duration-200">
										• You can reactivate your subscription
										anytime
									</li>
									<li className="hover:translate-x-2 transition-transform duration-200">
										• No hidden fees or cancellation charges
									</li>
								</ul>
								<div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300">
									<p className="text-sm text-green-700 dark:text-green-300">
										<strong>Good to know:</strong> The Free
										plan includes 1 portfolio, so
										you&apos;ll always have a way to
										showcase your work even after canceling.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			{/* Floating Animation Elements */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-ping"></div>
				<div className="absolute top-40 right-20 w-3 h-3 bg-blue-500/20 rounded-full animate-pulse"></div>
				<div className="absolute bottom-40 left-20 w-2 h-2 bg-purple-500/20 rounded-full animate-bounce"></div>
				<div className="absolute bottom-20 right-10 w-3 h-3 bg-green-500/20 rounded-full animate-ping"></div>
			</div>
		</div>
	);
}
