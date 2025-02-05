"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useDispatch } from "react-redux";
import { setPortfolios } from "@/redux/features/portfolioSlice";
import { setBlogs } from "@/redux/features/blogSlice";
import { logger } from "@/lib/utils";
import { setUser } from "@/redux/features/userSlice";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import ModeToggle from "@/components/mode-toggle";
import { useVerifyPayment } from "@/hooks/use-verify-payment";
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

export default function DashboardLayout({ children }) {
	useVerifyPayment();
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
					logger.error("API request failed", {
						status: response.status,
						statusText: response.statusText,
					});
					throw new Error("Failed to fetch user data");
				}

				const { portfolios, user } = await response.json();
				logger.info("Data received from API", {
					portfoliosCount: portfolios?.data?.length,
					hasUser: !!user,
				});

				if (portfolios?.data) {
					logger.info("Updating portfolios in store", {
						count: portfolios.data.length,
					});
					dispatch(setPortfolios(portfolios.data));

					// Fetch blogs for each portfolio
					const blogsPromises = portfolios.data.map(
						async (portfolio) => {
							try {
								const blogResponse = await fetch(
									`/api/blogs?portfolioId=${portfolio.id}`
								);
								if (!blogResponse.ok)
									throw new Error(
										`Failed to fetch blogs for portfolio ${portfolio.id}`
									);
								const { blogs } = await blogResponse.json();
								return blogs?.data || [];
							} catch (error) {
								logger.error(
									`Error fetching blogs for portfolio ${portfolio.id}:`,
									error
								);
								return [];
							}
						}
					);

					// Wait for all blog fetches to complete
					const allBlogs = await Promise.all(blogsPromises);
					// Combine all blogs into a single array
					const flattenedBlogs = allBlogs.flat();

					logger.info("Updating blogs in store", {
						totalBlogs: flattenedBlogs.length,
						portfoliosCount: portfolios.data.length,
						blogs: flattenedBlogs,
					});

					dispatch(setBlogs(flattenedBlogs));
				}

				if (user) {
					logger.info("Updating user in store", {
						userId: user.id,
					});
					dispatch(setUser(user));
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
		<OrganizationProvider>
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
																{
																	breadcrumb.label
																}
															</BreadcrumbPage>
														) : (
															<BreadcrumbLink
																href={
																	breadcrumb.href
																}
															>
																{
																	breadcrumb.label
																}
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
