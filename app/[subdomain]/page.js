"use client";

import { useState, useEffect } from "react";
import DefaultTemplate from "@/components/templates/main/default-template";
import PortfolioNavbar from "@/components/templates/shared/navbar";
import PortfolioSkeleton from "./components/portfolio-skeleton";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
	const { subdomain } = params;
	console.log("At subdomain page: ", subdomain);
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [portfolioData, setPortfolioData] = useState({
		basics: {},
		experience: [],
		education: [],
		skill: [],
		certification: [],
		project: [],
		hackathon: [],
		profile: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			if (!subdomain) {
				setError("Username is required");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				const response = await fetch(
					`/api/get-portfolio?username=${subdomain}`
				);

				if (!response.ok) {
					throw new Error(
						`Failed to fetch user data: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();

				setPortfolioData({
					basics: data.basics?.success ? data.basics.data : {},
					experience: data.experiences?.success
						? data.experiences.data
						: [],
					education: data.educations?.success
						? data.educations.data
						: [],
					skill: data.skills?.success ? data.skills.data : [],
					certification: data.certifications?.success
						? data.certifications.data
						: [],
					project: data.projects?.success ? data.projects.data : [],
					hackathon: data.hackathons?.success
						? data.hackathons.data
						: [],
					profile: data.profiles?.success ? data.profiles.data : [],
				});
			} catch (error) {
				console.error("Error fetching portfolio data:", error);
				setError(error.message);
			} finally {
				setIsLoading(false);
				console.log("Portfolio data set completely: ", portfolioData);
			}
		};

		fetchData();
	}, [subdomain]);
	console.log("Loading page");

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="rounded-lg bg-red-50 p-4 text-center">
					<h2 className="mb-2 text-lg font-semibold text-red-800">
						Error Loading Portfolio
					</h2>
					<p className="text-red-600">{error}</p>
					<button
						onClick={() => router.refresh()}
						className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return <PortfolioSkeleton />;
	}

	const filterVisible = (items) =>
		items?.filter((item) => item?.visible) ?? [];

	return (
		<div className="mx-auto h-full w-full max-w-3xl rounded-xl">
			<DefaultTemplate
				basics={portfolioData.basics}
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
