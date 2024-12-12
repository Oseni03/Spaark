"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCertifications } from "@/redux/features/certificationSlice";
import { setEducations } from "@/redux/features/educationSlice";
import { setExperience } from "@/redux/features/experienceSlice";
import { setProfiles } from "@/redux/features/profileSlice";
import { setSkills } from "@/redux/features/skillSlice";
import { updateBasics } from "@/redux/features/basicSlice";
import { setProjects } from "@/redux/features/projectSlice";

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

const BuilderLayout = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/get-portfolio`);
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const data = await response.json();

				// Dispatch actions to update Redux state
				if (data.profiles.success)
					dispatch(setProfiles(data.profiles.data));
				if (data.experiences.success)
					dispatch(setExperience(data.experiences.data));
				if (data.educations.success)
					dispatch(setEducations(data.educations.data));
				if (data.certifications.success)
					dispatch(setCertifications(data.certifications.data));
				if (data.skills.success) dispatch(setSkills(data.skills.data));
				if (data.basics.success)
					dispatch(updateBasics(data.basics.data));
				if (data.projects.success)
					dispatch(setProjects(data.projects.data));
				if (data.hackathons.success)
					dispatch(setProjects(data.hackathons.data));
			} catch (error) {
				console.log("Error fetching or updating user data:", error);
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
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default BuilderLayout;
