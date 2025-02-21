"use client";

import React, { Suspense } from "react";
import { LeftAppSidebar } from "@/components/left-app-sidebar";
import { RightSidebar } from "@/components/right-app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	PORTFOLIO_TAILWIND_CLASS,
	CONTAINER_CLASS,
	CONTENT_CLASS,
} from "@/utils/constants";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import { useVerifyPayment } from "@/hooks/use-verify-payment";

function BuilderLayoutContent({ children }) {
	useVerifyPayment();
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const [leftOpen, setLeftOpen] = React.useState(true);
	const [rightOpen, setRightOpen] = React.useState(false);
	const [leftCollapsed, setLeftCollapsed] = React.useState(false);
	const [rightCollapsed, setRightCollapsed] = React.useState(true);

	if (isDesktop) {
		return (
			<div className="relative h-screen overflow-hidden">
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel
						defaultSize={20}
						minSize={0}
						maxSize={30}
						collapsible={true}
						collapsedSize={0}
						onCollapse={() => setLeftCollapsed(true)}
						onExpand={() => setLeftCollapsed(false)}
						className={cn(
							"bg-background transition-all duration-300",
							leftCollapsed && "min-w-0 max-w-0 p-0 opacity-0"
						)}
					>
						<LeftAppSidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>
						<div className="flex h-full flex-col">
							<header className="flex h-14 shrink-0 items-center gap-2 px-4 sm:px-6 lg:px-8">
								<div className="flex flex-1 items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											setLeftCollapsed(!leftCollapsed)
										}
										className={cn(
											"transition-transform",
											leftCollapsed && "rotate-180"
										)}
									>
										<PanelLeft className="h-5 w-5" />
									</Button>
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
								<div className="ml-auto flex items-center gap-2">
									<NavActions />
									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											setRightCollapsed(!rightCollapsed)
										}
										className={cn(
											"transition-transform",
											rightCollapsed && "-rotate-180"
										)}
									>
										<PanelRight className="h-5 w-5" />
									</Button>
								</div>
							</header>
							<main
								className={cn(
									"flex-1 overflow-auto",
									CONTAINER_CLASS
								)}
							>
								<div className={CONTENT_CLASS}>{children}</div>
							</main>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel
						defaultSize={20}
						minSize={0}
						maxSize={30}
						collapsible={true}
						collapsedSize={0}
						onCollapse={() => setRightCollapsed(true)}
						onExpand={() => setRightCollapsed(false)}
						className={cn(
							"bg-background transition-all duration-300",
							rightCollapsed && "min-w-0 max-w-0 p-0 opacity-0"
						)}
					>
						<RightSidebar />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen">
			<Sheet open={leftOpen} onOpenChange={setLeftOpen}>
				<SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0">
					<LeftAppSidebar />
				</SheetContent>
			</Sheet>

			<div className="flex min-h-screen flex-col">
				<header className="flex h-14 shrink-0 items-center gap-2 px-4">
					<div className="flex flex-1 items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setLeftOpen(true)}
						>
							<PanelLeft className="h-5 w-5" />
						</Button>
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
					<div className="ml-auto flex items-center gap-2">
						<NavActions />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setRightOpen(true)}
						>
							<PanelRight className="h-5 w-5" />
						</Button>
					</div>
				</header>
				<main className={cn("flex-1", CONTAINER_CLASS)}>
					<div className={CONTENT_CLASS}>{children}</div>
				</main>
			</div>

			<Sheet open={rightOpen} onOpenChange={setRightOpen}>
				<SheetContent
					side="right"
					className="w-[80vw] sm:w-[350px] p-0"
				>
					<RightSidebar />
				</SheetContent>
			</Sheet>
		</div>
	);
}

function BuilderLayout({ children }) {
	return (
		<Suspense fallback={null}>
			<BuilderLayoutContent>{children}</BuilderLayoutContent>
		</Suspense>
	);
}

export default BuilderLayout;
