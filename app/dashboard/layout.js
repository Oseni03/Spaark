"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useDispatch } from "react-redux";
import { setPortfolios } from "@/redux/features/portfolioSlice";
import { logger } from "@/lib/utils";
import { setUser } from "@/redux/features/userSlice";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import ModeToggle from "@/components/mode-toggle";

export default function DashboardLayout({ children }) {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/get-portfolio`);
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const { portfolios, user } = await response.json();

				if (portfolios) dispatch(setPortfolios(portfolios.data));
				if (user) dispatch(setUser(user));
			} catch (error) {
				logger.error("Error fetching or updating user data:", error);
			}
		};

		fetchData();
	}, [dispatch]);

	return (
		<OrganizationProvider>
			<SidebarProvider>
				<DashboardSidebar />
				<main className="flex flex-1 min-h-screen">
					<div className="p-2 md:p-10 flex flex-col gap-2 flex-1 w-full h-full">
						<div className="flex items-center justify-between">
							<SidebarTrigger />
							<ModeToggle />
						</div>
						{children}
					</div>
				</main>
			</SidebarProvider>
		</OrganizationProvider>
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
