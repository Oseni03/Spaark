"use client";

import { useState, useEffect } from "react";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import PortfolioSkeleton from "./components/portfolio-skeleton";
import { usePortfolio } from "@/context/PortfolioContext";
import { logger } from "@/lib/utils";
import { CONTAINER_CLASS, CONTENT_CLASS } from "@/utils/constants";
import { cn } from "@/lib/utils";

export default function Page() {
	const { portfolio } = usePortfolio();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (portfolio) {
			setIsLoading(false);
		}
	}, [portfolio]);

	if (isLoading) {
		return (
			<div className={cn(CONTAINER_CLASS, "py-12")}>
				<div className={CONTENT_CLASS}>
					<PortfolioSkeleton />
				</div>
			</div>
		);
	}

	const portfolioData = {
		basics: portfolio?.basics || defaultBasics,
		experiences: (portfolio?.experiences?.items || []).filter(
			(item) => item.visible
		),
		projects: (portfolio?.projects?.items || []).filter(
			(item) => item.visible
		),
		educations: (portfolio?.educations?.items || []).filter(
			(item) => item.visible
		),
		skills: (portfolio?.skills?.items || []).filter((item) => item.visible),
		hackathons: (portfolio?.hackathons?.items || []).filter(
			(item) => item.visible
		),
		certifications: (portfolio?.certifications?.items || []).filter(
			(item) => item.visible
		),
		profiles: portfolio?.profiles?.items || [],
		blogEnabled: portfolio?.blogEnabled || false,
	};

	logger.info("Portfolio data: ", portfolioData);

	// Determine the template to use
	const templateToUse = portfolio.template || "default";

	return (
		<div className={cn(CONTAINER_CLASS, "min-h-screen")}>
			<div className={CONTENT_CLASS}>
				<TemplateWrapper
					template={templateToUse}
					data={portfolioData}
					className="py-12 sm:py-16 lg:py-24"
				/>
			</div>
		</div>
	);
}
