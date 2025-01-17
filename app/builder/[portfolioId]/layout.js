"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
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
import PortfolioNavbar from "@/components/templates/shared/navbar";

function BuilderLayout({ children }) {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

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
					<PortfolioNavbar
						profile={portfolio?.profiles?.items || []}
					/>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default BuilderLayout;
