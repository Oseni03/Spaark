"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useDispatch } from "react-redux";
import { setPortfolios } from "@/redux/features/portfolioSlice";
import { logger } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import ModeToggle from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const generateBreadcrumbs = (pathname) => {
	const paths = pathname.split("/").filter(Boolean);
	return paths.map((path, index) => ({
		label: path.charAt(0).toUpperCase() + path.slice(1),
		href: "/" + paths.slice(0, index + 1).join("/"),
		current: index === paths.length - 1,
	}));
};

const DashboardLayoutContent = ({ children }) => {
	const dispatch = useDispatch();
	const pathname = usePathname();
	const breadcrumbs = generateBreadcrumbs(pathname);

	useEffect(() => {
		const fetchData = async () => {
			const startTime = performance.now();
			logger.info("Starting dashboard data fetch");

			try {
				logger.info("Fetching portfolio data from API");
				const response = await fetch(`/api/portfolio`);

				if (!response.ok) {
					logger.error("Portfolio API request failed", {
						status: response.status,
						statusText: response.statusText,
					});
					throw new Error("Failed to fetch user data");
				}

				const { portfolios } = await response.json();
				logger.info("Portfolio data received from API", {
					count: portfolios?.data?.length || 0,
				});

				if (portfolios.data) {
					logger.info("Updating portfolios in store", {
						count: portfolios.data.length,
					});
					dispatch(setPortfolios(portfolios.data));
				}

				const endTime = performance.now();
				logger.info("Dashboard data fetch completed", {
					duration: `${(endTime - startTime).toFixed(2)}ms`,
				});
			} catch (error) {
				logger.error("Error in dashboard data fetch", {
					error: error.message,
					stack: error.stack,
				});
			}
		};

		fetchData();
	}, [dispatch]);

	logger.info("Rendering dashboard layout");
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<main className="flex flex-1 min-h-screen">
				<div className="p-2 md:p-10 flex flex-col gap-2 flex-1 w-full h-full">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<SidebarTrigger />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="/dashboard">
											Dashboard
										</BreadcrumbLink>
									</BreadcrumbItem>
									{breadcrumbs
										.slice(1)
										.map((breadcrumb, index) => (
											<React.Fragment
												key={breadcrumb.href}
											>
												<BreadcrumbSeparator />
												<BreadcrumbItem>
													{breadcrumb.current ? (
														<BreadcrumbPage>
															{breadcrumb.label}
														</BreadcrumbPage>
													) : (
														<BreadcrumbLink
															href={
																breadcrumb.href
															}
														>
															{breadcrumb.label}
														</BreadcrumbLink>
													)}
												</BreadcrumbItem>
											</React.Fragment>
										))}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<ModeToggle />
					</div>
					<div className="max-w-6xl">
						<div className="mx-auto">{children}</div>
					</div>
				</div>
			</main>
		</SidebarProvider>
	);
};

export default function DashboardLayout({ children }) {
	return (
		<Suspense fallback={null}>
			<DashboardLayoutContent>{children}</DashboardLayoutContent>
		</Suspense>
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
