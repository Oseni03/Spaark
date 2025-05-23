"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import { defaultBasics } from "@/schema/sections/basics";
import { CONTENT_CLASS } from "@/utils/constants";
import { logger } from "@/lib/utils";
import { useEffect, useState } from "react";
import PortfolioSkeleton from "@/components/portfolio-skeleton";
import { defaultMetadata } from "@/schema/sections";

export default function Page() {
	const { portfolioId } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	useEffect(() => {
		if (portfolio) {
			setIsLoading(false);
		}
	}, [portfolio]);

	if (isLoading) {
		return (
			<div className="min-h-screen w-full">
				<div className={CONTENT_CLASS}>
					<PortfolioSkeleton />
				</div>
			</div>
		);
	}

	const templateData = {
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
		metadata: portfolio?.metadata || defaultMetadata,
		blogEnabled: portfolio?.blogEnabled || false,
	};

	logger.info("template data: ", portfolio);

	return (
		<div className="min-h-screen w-full">
			<div className={CONTENT_CLASS}>
				<TemplateWrapper
					template={portfolio.metadata.template || "default"}
					data={templateData}
					className="h-[calc(100vh-120px)]"
				/>
			</div>
		</div>
	);
}
