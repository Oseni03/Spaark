"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setCertifications,
	setEducations,
	setProfiles,
	setSkills,
	updateBasics,
	setProjects,
	setExperience,
} from "@/redux/features/portfolioSlice";
import { setUser } from "@/redux/features/userSlice";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PORTFOLIO_TAILWIND_CLASS } from "@/utils/constants";
import { setHackathons } from "@/redux/features/hackathonSlice";
import PortfolioNavbar from "@/components/templates/shared/navbar";
import { logger } from "@/lib/utils";

const BuilderLayout = ({ children }) => {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/get-portfolio`);
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const data = await response.json();

				// Dispatch actions to update Redux state
				data.portfolios.forEach((portfolioData) => {
					const {
						portfolio,
						basics,
						profiles,
						experiences,
						educations,
						certifications,
						skills,
						projects,
						hackathons,
					} = portfolioData;

					if (basics)
						dispatch(
							updateBasics({ portfolioId: portfolio.id, basics })
						);
					if (profiles)
						dispatch(
							setProfiles({ portfolioId: portfolio.id, profiles })
						);
					if (experiences)
						dispatch(
							setExperience({
								portfolioId: portfolio.id,
								experiences,
							})
						);
					if (educations)
						dispatch(
							setEducations({
								portfolioId: portfolio.id,
								educations,
							})
						);
					if (certifications)
						dispatch(
							setCertifications({
								portfolioId: portfolio.id,
								certifications,
							})
						);
					if (skills)
						dispatch(
							setSkills({ portfolioId: portfolio.id, skills })
						);
					if (projects)
						dispatch(
							setProjects({ portfolioId: portfolio.id, projects })
						);
					if (hackathons)
						dispatch(
							setHackathons({
								portfolioId: portfolio.id,
								hackathons,
							})
						);
				});

				if (data.user) dispatch(setUser(data.user));
			} catch (error) {
				logger.error("Error fetching or updating user data:", error);
			}
		};

		fetchData();
	}, [dispatch]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator
							orientation="vertical"
							className="mr-2 h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="line-clamp-1">
										Portfolio Builder
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="ml-auto px-3">
						<NavActions />
					</div>
				</header>
				<div
					className={cn(
						"flex flex-1 flex-col gap-4 px-4 py-10",
						PORTFOLIO_TAILWIND_CLASS
					)}
				>
					{children}
					<PortfolioNavbar profile={profile.items || []} />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default BuilderLayout;
