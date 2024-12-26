"use client";

import { useState, useEffect } from "react";
import NotFound from "../not-found";
import DefaultTemplate from "@/components/templates/main/default-template";
import PortfolioNavbar from "@/components/templates/shared/navbar";
import PortfolioSkeleton from "./components/portfolio-skeleton";

const INITIAL_STATE = {
	basics: {},
	experience: [],
	education: [],
	skill: [],
	certification: [],
	project: [],
	hackathon: [],
	profile: [],
};

const logger = {
	info: (...args) => console.log("[Portfolio]", ...args),
	error: (...args) => console.error("[Portfolio Error]", ...args),
};

export default function Page({ params }) {
	const { subdomain } = params;
	const [isLoading, setIsLoading] = useState(true);
	const [portfolioData, setPortfolioData] = useState(INITIAL_STATE);

	useEffect(() => {
		if (!subdomain) {
			logger.error("No subdomain provided");
			NotFound();
		}

		const fetchData = async () => {
			try {
				logger.info(`Fetching portfolio data for ${subdomain}`);
				const response = await fetch(
					`/api/get-portfolio?username=${subdomain}`
				);
				const data = await response.json();

				logger.info(`Data received for ${subdomain}`, {
					hasBasics: !!data.basics?.data,
					itemCounts: {
						experiences: data.experiences?.data?.length || 0,
						projects: data.projects?.data?.length || 0,
						skills: data.skills?.data?.length || 0,
						profiles: data.profiles?.data?.length || 0,
					},
				});

				setPortfolioData({
					basics: data.basics?.data || {},
					experience: data.experiences?.data || [],
					education: data.educations?.data || [],
					skill: data.skills?.data || [],
					certification: data.certifications?.data || [],
					project: data.projects?.data || [],
					hackathon: data.hackathons?.data || [],
					profile: data.profiles?.data || [],
				});
			} catch (error) {
				logger.error(
					`Failed to fetch portfolio for ${subdomain}`,
					error
				);
				NotFound();
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [subdomain]);

	if (isLoading) return <PortfolioSkeleton />;

	const filterVisible = (items) => items.filter((item) => item?.visible);

	return (
		<div className="mx-auto h-full w-full max-w-3xl rounded-xl">
			<DefaultTemplate
				{...portfolioData}
				projects={filterVisible(portfolioData.project)}
				experiences={filterVisible(portfolioData.experience)}
				educations={filterVisible(portfolioData.education)}
				skills={filterVisible(portfolioData.skill)}
				hackathons={filterVisible(portfolioData.hackathon)}
				certifications={filterVisible(portfolioData.certification)}
			/>
			<PortfolioNavbar profile={portfolioData.profile} />
		</div>
	);
}
