"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import DefaultTemplate from "@/components/templates/default";
import PortfolioSkeleton from "./components/portfolio-skeleton";
import { useUser } from "@/context/UserContext";
import { logger } from "@/lib/utils";

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

export default function Page({ params }) {
	const { user } = useUser();
	const resolvedParams = use(params);
	const { subdomain } = resolvedParams;
	const [isLoading, setIsLoading] = useState(true);
	const [portfolioData, setPortfolioData] = useState(INITIAL_STATE);
	const [template, setTemplate] = useState("default");

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

				setTemplate(data.template || "default");
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

	if (isLoading)
		return (
			<div className="mx-auto w-full max-w-2xl py-12 sm:py-24 px-6">
				<PortfolioSkeleton />
			</div>
		);
	logger.info("Portfolio data: ", portfolioData);

	const filterVisible = (items) => items.filter((item) => item?.visible);

	return (
		<div className="mx-auto w-full max-w-2xl py-12 sm:py-24 px-6">
			<DefaultTemplate
				{...portfolioData}
				projects={filterVisible(portfolioData.project)}
				experiences={filterVisible(portfolioData.experience)}
				educations={filterVisible(portfolioData.education)}
				skills={filterVisible(portfolioData.skill)}
				hackathons={filterVisible(portfolioData.hackathon)}
				certifications={filterVisible(portfolioData.certification)}
				profiles={portfolioData.profile}
			/>
		</div>
	);
}
