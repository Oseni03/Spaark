"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
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

export default function Page({ params, user }) {
	logger.info("UserId: ", user);
	logger.info("params: ", params);
	const { subdomain } = params;
	const [isLoading, setIsLoading] = useState(true);
	const [portfolioData, setPortfolioData] = useState(INITIAL_STATE);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!user) {
					notFound();
				}

				logger.info(`Fetching portfolio data for ${subdomain}`);
				const response = await fetch(
					`/api/get-portfolio?userId=${user.id}`
				);

				if (!response.ok) throw new Error("Failed to fetch portfolio");

				const data = await response.json();

				if (!data.basics?.data)
					throw new Error("No portfolio data found");

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
				setIsLoading(false);
			} catch (error) {
				logger.error(error);
				notFound();
			}
		};

		fetchData();
	}, [subdomain, user]);

	if (isLoading) return <PortfolioSkeleton />;
	logger.info("Portfolio data: ", portfolioData);

	const filterVisible = (items) => items.filter((item) => item?.visible);

	return (
		<div>
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
