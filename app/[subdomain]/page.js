"use client";

import { useState, useEffect } from "react";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import PortfolioSkeleton from "./components/portfolio-skeleton";
import { usePortfolio } from "@/context/PortfolioContext";
import { logger } from "@/lib/utils";

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
			<div className="mx-auto w-full max-w-2xl py-12 sm:py-24 px-6">
				<PortfolioSkeleton />
			</div>
		);
	}

	const portfolioData = {
		basics: portfolio.basics || {},
		experiences: (portfolio.experiences?.items || []).filter(
			(item) => item.visible
		),
		educations: (portfolio.educations?.items || []).filter(
			(item) => item.visible
		),
		skills: (portfolio.skills?.items || []).filter((item) => item.visible),
		certifications: (portfolio.certifications?.items || []).filter(
			(item) => item.visible
		),
		projects: (portfolio.projects?.items || []).filter(
			(item) => item.visible
		),
		hackathons: (portfolio.hackathons?.items || []).filter(
			(item) => item.visible
		),
		profiles: portfolio.profiles?.items || [],
	};

	logger.info("Portfolio data: ", portfolioData);

	// Determine the template to use
	const templateToUse =
		portfolio.template || portfolio.basics?.template || "default";

	return (
		<div className="mx-auto w-full max-w-2xl h-[calc(100vh-48px)]">
			<TemplateWrapper
				template={templateToUse}
				data={portfolioData}
				className="h-full py-12 sm:py-24"
			/>
		</div>
	);
}
