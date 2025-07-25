"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { cn, logger } from "@/lib/utils";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Globe, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { updatePortfolio } from "@/redux/features/portfolioSlice";
import { checkPortfolioLiveAuth } from "@/middleware/subscription-auth";
import { siteConfig } from "@/config/site";

const templateTheme = {
	default: {
		text: "#0A0A0A", // text-muted-foreground
		primary: "#171717",
		background: "#FFFFFF",
	},
	violetvista: {
		text: "#FFFFFF",
		primary: "#FF4D4D",
		background: "#111111",
	},
	neomint: {
		text: "#0A0A0A", // text-muted-foreground
		primary: "#171717",
		background: "#FFFFFF",
	},
};

export function TemplateSection() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();
	const { user } = useAuth();

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	logger.info("Current portfolio:", portfolio); // Debug log
	logger.info("Available templates:", siteConfig.templates); // Debug log

	const selectedTemplate = portfolio?.template || "default";
	logger.info("Selected template:", selectedTemplate); // Debug log

	const handleTemplateSelect = (templateId) => {
		if (!portfolio) return;

		dispatch(
			updatePortfolio({
				id: portfolio.id,
				data: {
					template: templateId,
				},
			})
		);

		toast.success("Template updated successfully");
	};

	const handleManageSubscription = async () => {
		try {
			await authClient.customer.portal();
		} catch (error) {
			logger.error("Failed to open customer portal:", error);
			toast.error("Failed to open subscription management");
		}
	};

	const toggleLiveStatus = async () => {
		if (!portfolio) return;

		// If trying to make portfolio live, check authorization
		if (!portfolio.isLive) {
			const liveAuthCheck = await checkPortfolioLiveAuth(user.id);

			if (!liveAuthCheck.allowed) {
				logger.warn("Portfolio live status blocked", {
					portfolioId,
					reason: liveAuthCheck.reason,
					details: liveAuthCheck.details,
				});

				toast.error(
					liveAuthCheck.reason || "Portfolio limit reached.",
					{
						description: "Please upgrade your plan.",
						action: { onClick: handleManageSubscription },
					}
				);
				return;
			}
		}

		// If all checks pass, update the portfolio
		dispatch(
			updatePortfolio({
				id: portfolio.id,
				data: { isLive: !portfolio.isLive },
			})
		);

		toast.success(
			portfolio.isLive
				? "Portfolio is now hidden"
				: "Portfolio is now live!"
		);
	};

	function copyToClipboard() {
		if (!portfolio.customDomain && !portfolio.slug) {
			toast.error("Portfolio slug not set");
			return;
		}
		const text = portfolio.customDomain
			? portfolio.customDomain
			: `${portfolio.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

		try {
			// Modern clipboard API
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard
					.writeText(text)
					.then(() => {
						toast.success("Copied to clipboard");
					})
					.catch((err) => {
						toast.error("Failed to copy");
						logger.error("Copy failed", err);
					});
			} else {
				// Fallback method
				const textArea = document.createElement("textarea");
				textArea.value = text;

				textArea.style.position = "fixed";
				textArea.style.left = "-999999px";
				textArea.style.top = "-999999px";
				document.body.appendChild(textArea);

				textArea.focus();
				textArea.select();

				try {
					const successful = document.execCommand("copy");
					if (successful) {
						toast.success("Copied to clipboard");
					} else {
						toast.error("Copy failed");
					}
				} catch (err) {
					toast.error("Copy failed");
					logger.error("Unable to copy", err);
				}

				document.body.removeChild(textArea);
			}
		} catch (err) {
			toast.error("Copy failed");
			logger.error("Copy error", err);
		}
	}

	return (
		<>
			<section id="template" className="flex h-full flex-col gap-y-4">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<Label>Live Status</Label>
							<div className="text-sm text-muted-foreground">
								{portfolio?.isLive ? (
									<span className="flex items-center gap-2">
										<Globe className="text-green-500" />
										Your portfolio is live
									</span>
								) : (
									<span className="flex items-center gap-2">
										<EyeSlash className="text-yellow-500" />
										Your portfolio is hidden
									</span>
								)}
							</div>
						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Switch
										checked={portfolio?.isLive}
										onCheckedChange={toggleLiveStatus}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{portfolio?.isLive
											? "Take portfolio offline"
											: "Make portfolio live"}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							size="sm"
							onClick={copyToClipboard}
						>
							<Globe className="mr-2 h-4 w-4" />
							Copy URL
						</Button>
					</div>
					<Separator />
				</div>

				<header className="flex shrink-0 items-center justify-between">
					<div className="flex items-center gap-x-4">
						<h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">
							Template
						</h2>
					</div>
				</header>

				<ScrollArea className="flex-1 -mx-6 px-6">
					<div className="grid grid-cols-2 gap-x-6 gap-y-1 @lg/right:grid-cols-3 @2xl/right:grid-cols-4">
						{siteConfig.templates.map((template, index) => (
							<div key={template.id} className="w-full h-[280px]">
								<AspectRatio
									ratio={1 / 1.4142}
									className="h-full"
								>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											transition: { delay: index * 0.1 },
										}}
										whileTap={{
											scale: 0.98,
											transition: { duration: 0.1 },
										}}
										className={cn(
											"relative h-full w-full cursor-pointer rounded-sm ring-primary transition-all hover:ring-2",
											selectedTemplate === template.id &&
												"ring-2"
										)}
										onClick={() =>
											handleTemplateSelect(template.id)
										}
									>
										<Image
											src={template.preview}
											alt={template.name}
											fill
											className="object-cover rounded-sm"
											sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
											priority={index < 4}
										/>

										<div className="absolute inset-x-0 bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-background/80">
											<div className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-1">
												<p className="text-center font-bold capitalize text-primary">
													{template.name}
												</p>
											</div>
										</div>
									</motion.div>
								</AspectRatio>
							</div>
						))}
					</div>
				</ScrollArea>
			</section>
		</>
	);
}
