"use client";

import { useState, useEffect } from "react";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import PortfolioSkeleton from "@/components/portfolio-skeleton";
import { usePortfolio } from "@/context/PortfolioContext";
import { logger } from "@/lib/utils";
import { CONTAINER_CLASS, CONTENT_CLASS } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { defaultMetadata } from "@/schema/sections";

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
		socials: portfolio?.socials?.items || [],
		metadata: JSON.parse(portfolio?.metadata) || defaultMetadata,
		blogEnabled: portfolio?.blogEnabled || false,
	};

	logger.info("Portfolio data: ", portfolioData);

	return (
		<div className={cn(CONTAINER_CLASS, "min-h-screen")}>
			<div className={CONTENT_CLASS}>
				<TemplateWrapper
					template={portfolio?.metadata?.template || "default"}
					data={portfolioData}
					// className="py-12 sm:py-16 lg:py-24"
				/>
			</div>
		</div>
	);
}
