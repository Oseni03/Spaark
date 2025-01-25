"use client";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";
import { SectionIcon } from "../section-icon";
import { AspectRatio } from "../ui/aspect-ratio";
import { motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";

const templates = [
	{
		id: "minimal",
		name: "Minimal",
		description: "Clean and simple design focusing on content",
		preview: "/templates/minimal.png",
	},
	{
		id: "modern",
		name: "Modern",
		description: "Contemporary design with bold elements",
		preview: "/templates/modern.png",
	},
	{
		id: "classic",
		name: "Classic",
		description: "Traditional resume-style layout",
		preview: "/templates/classic.png",
	},
];

export function TemplateSection() {
	const { portfolioId } = useParams();
	const dispatch = useDispatch();

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const selectedTemplate = portfolio?.template || "default";

	const handleTemplateSelect = (templateId) => {
		dispatch(
			updatePortfolioInDatabase({
				id: portfolio.id,
				data: { ...portfolio, template: templateId },
			})
		);
	};

	return (
		<section id="template" className="flex h-full flex-col gap-y-4">
			<header className="flex shrink-0 items-center justify-between">
				<div className="flex items-center gap-x-4">
					<SectionIcon id="template" size={18} name={`Template`} />
					<h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">{`Template`}</h2>
				</div>
			</header>

			<ScrollArea className="flex-1 -mx-6 px-6">
				<div className="grid grid-cols-2 gap-8 @lg/right:grid-cols-3 @2xl/right:grid-cols-4">
					{templates.map((template, index) => (
						<AspectRatio key={template.id} ratio={1 / 1.4142}>
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
									"relative cursor-pointer rounded-sm ring-primary transition-all hover:ring-2",
									selectedTemplate === template.id && "ring-2"
								)}
								onClick={() =>
									handleTemplateSelect(template.id)
								}
							>
								<Image
									src={template.preview}
									alt={template.name}
									fill
									className="object-cover"
								/>

								<div className="absolute inset-x-0 bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-background/80">
									<p className="absolute inset-x-0 bottom-2 text-center font-bold capitalize text-primary">
										{template.name}
									</p>
								</div>
							</motion.div>
						</AspectRatio>
					))}
				</div>
			</ScrollArea>
		</section>
	);
}
