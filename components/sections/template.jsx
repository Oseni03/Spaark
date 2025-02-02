"use client";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { cn, logger } from "@/lib/utils";
import Image from "next/image";
import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";
import { SectionIcon } from "../section-icon";
import { AspectRatio } from "../ui/aspect-ratio";
import { motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Globe, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const templates = [
	{
		id: "default",
		name: "Default",
		preview: "/templates/default.png",
	},
	// Add more templates as needed
];

export function TemplateSection() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	logger.info("Current portfolio:", portfolio); // Debug log
	logger.info("Available templates:", templates); // Debug log

	const selectedTemplate = portfolio?.template || "default";
	logger.info("Selected template:", selectedTemplate); // Debug log

	const handleTemplateSelect = (templateId) => {
		if (!portfolio) return;

		dispatch(
			updatePortfolioInDatabase({
				id: portfolio.id,
				data: { ...portfolio, template: templateId },
			})
		);
	};

	const toggleLiveStatus = async () => {
		if (!portfolio) return;

		dispatch(
			updatePortfolioInDatabase({
				id: portfolio.id,
				data: { ...portfolio, isPublic: !portfolio.isPublic },
			})
		);
	};

	return (
		<section id="template" className="flex h-full flex-col gap-y-4">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label>Live Status</Label>
						<div className="text-sm text-muted-foreground">
							{portfolio?.isPublic ? (
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
					<Switch
						checked={portfolio?.isPublic}
						onCheckedChange={toggleLiveStatus}
					/>
				</div>

				<div className="flex items-center gap-4">
					<Button variant="outline" size="sm">
						<Eye className="mr-2 h-4 w-4" />
						Preview Portfolio
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
				<div className="grid grid-cols-2 gap-8 @lg/right:grid-cols-3 @2xl/right:grid-cols-4">
					{templates.map((template, index) => (
						<div key={template.id} className="w-full h-[280px]">
							<AspectRatio ratio={1 / 1.4142} className="h-full">
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
	);
}
