"use client";
import React, { useState, useEffect } from "react";
import {
	Sidebar,
	SidebarBody,
	SidebarLink,
} from "@/components/aceternity/sidebar";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconSettings,
	IconBook,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegments } from "next/navigation";
import { siteConfig } from "@/config/site";
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
import { setHackathons } from "@/redux/features/hackathonSlice";
import { logger } from "@/lib/utils";
import { setUser } from "@/redux/features/userSlice";

export default function DashboardLayout({ children }) {
	const segments = useSelectedLayoutSegments();
	const dispatch = useDispatch();

	const links = [
		{
			label: "Portfolios",
			href: "/dashboard/portfolios",
			icon: (
				<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Blogs",
			href: "/dashboard/blogs",
			icon: (
				<IconBook className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Settings",
			href: "#",
			icon: (
				<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: "Logout",
			href: "#",
			icon: (
				<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
	];
	const [open, setOpen] = useState(false);

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

	const isSelected = (href) => {
		return segments.includes(href.split("/").pop());
	};
	return (
		<div
			className={cn(
				"rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
				"min-h-screen"
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, idx) => (
								<SidebarLink
									key={idx}
									link={link}
									className={cn(
										"sidebar-link",
										isSelected(link.href) &&
											"bg-gray-100 dark:bg-neutral-800"
									)}
								/>
							))}
						</div>
					</div>
					<div>
						<SidebarLink
							link={{
								label: "Manu Arora",
								href: "#",
								icon: (
									<img
										src="https://assets.aceternity.com/manu.png"
										className="h-7 w-7 flex-shrink-0 rounded-full"
										width={50}
										height={50}
										alt="Avatar"
									/>
								),
							}}
						/>
					</div>
				</SidebarBody>
			</Sidebar>
			<div className="flex flex-1">
				<div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
					{children}
				</div>
			</div>
		</div>
	);
}
export const Logo = () => {
	return (
		<Link
			href="/"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<Image
				src="/icon.png"
				className="h-7 w-7 flex-shrink-0 rounded-full"
				width={50}
				height={50}
				alt={siteConfig.name}
			/>
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-medium text-black dark:text-white whitespace-pre"
			>
				{siteConfig.name}
			</motion.span>
		</Link>
	);
};
export const LogoIcon = () => {
	return (
		<Link
			href="/"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<Image
				src="/icon.png"
				className="h-7 w-7 flex-shrink-0 rounded-full"
				width={50}
				height={50}
				alt={siteConfig.name}
			/>
		</Link>
	);
};
