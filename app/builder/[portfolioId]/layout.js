"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { LeftAppSidebar } from "@/components/left-app-sidebar";
import { RightSidebar } from "@/components/right-app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { cn, logger } from "@/lib/utils";
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
import {
	PanelLeft,
	PanelRight,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Eye,
	Save,
	Settings,
} from "lucide-react";
import { useVerifyPayment } from "@/hooks/use-verify-payment";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { X } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { updatePortfolioWithSections } from "@/services/portfolio";
import ProtectedRoute from "@/app/protected-route";

function BuilderLayoutContent({ children }) {
	useVerifyPayment();
	const router = useRouter();
	const { portfolioId } = useParams();
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const [leftOpen, setLeftOpen] = React.useState(true);
	const [rightOpen, setRightOpen] = React.useState(false);
	const [leftCollapsed, setLeftCollapsed] = React.useState(false);
	const [rightCollapsed, setRightCollapsed] = React.useState(true);
	const [wheelPanning, setWheelPanning] = useState(true);
	const [scale, setScale] = useState(0.8);
	const transformRef = useRef(null);
	const { user, signOut } = useAuth();
	const [showBanner, setShowBanner] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	if (!portfolio) {
		router.push("/dashboard/portfolios");
	}

	const handleZoomIn = () => {
		transformRef.current?.zoomIn(0.2);
		setScale((prev) => Math.min(prev + 0.2, 2));
	};

	const handleZoomOut = () => {
		transformRef.current?.zoomOut(0.2);
		setScale((prev) => Math.max(prev - 0.2, 0.4));
	};

	const handleReset = () => {
		transformRef.current?.resetTransform(0);
		setScale(0.8);
		setTimeout(() => transformRef.current?.centerView(0.8, 0), 10);
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);

			// Show loading toast
			const loadingToast = toast.loading("Saving changes...", {
				description: "Please wait while we save your portfolio.",
			});

			// Call the server function to update the portfolio
			const result = await updatePortfolioWithSections(
				portfolioId,
				portfolio
			);

			if (result.error) {
				throw new Error(result.error);
			}

			// Update loading toast to success
			toast.dismiss(loadingToast);
			toast.success("Changes saved", {
				description: "Your portfolio has been updated successfully.",
			});
		} catch (error) {
			logger.error("Error saving portfolio:", error);
			toast.error("Error saving changes", {
				description: error.message || "Failed to save changes",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const SubscriptionBanner = () =>
		user?.subscription?.status !== "active" &&
		showBanner && (
			<div className={cn(CONTAINER_CLASS, "mb-6")}>
				<div className="relative bg-blue-50 dark:bg-blue-900/50 px-4 sm:px-6 py-4 flex items-center justify-between rounded-lg border border-blue-100 dark:border-blue-800">
					<div className="flex items-center gap-x-3">
						<p className="text-sm text-blue-700 dark:text-blue-100">
							You do not have an active subscription!{" "}
							<Link
								href="/#pricing"
								className="font-medium underline hover:text-blue-600 dark:hover:text-blue-400"
							>
								Subscribe now
							</Link>
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:bg-blue-100/50 dark:hover:bg-blue-800/50"
						onClick={() => setShowBanner(false)}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		);

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.origin !== window.location.origin) return;

			if (event.data.type === "ZOOM_IN")
				transformRef.current?.zoomIn(0.2);
			if (event.data.type === "ZOOM_OUT")
				transformRef.current?.zoomOut(0.2);
			if (event.data.type === "CENTER_VIEW")
				transformRef.current?.centerView();
			if (event.data.type === "RESET_VIEW") {
				transformRef.current?.resetTransform(0);
				setTimeout(() => transformRef.current?.centerView(0.8, 0), 10);
			}
			if (event.data.type === "TOGGLE_PAN_MODE") {
				setWheelPanning(event.data.panMode);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [transformRef]);

	if (isDesktop) {
		return (
			<ProtectedRoute>
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
													<BreadcrumbLink href="/dashboard/portfolio">
														Dashboard
													</BreadcrumbLink>
												</BreadcrumbItem>
												<BreadcrumbItem>
													<BreadcrumbPage className="line-clamp-1">
														Portfolio Builder
													</BreadcrumbPage>
												</BreadcrumbItem>
											</BreadcrumbList>
										</Breadcrumb>
									</div>
									<div className="ml-auto flex items-center gap-2">
										<TooltipProvider>
											<div className="flex items-center gap-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-1 rounded-lg border">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={
																handleZoomOut
															}
															disabled={
																scale <= 0.4
															}
														>
															<ZoomOut className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														Zoom Out
													</TooltipContent>
												</Tooltip>
												<span className="text-sm text-muted-foreground min-w-[40px] text-center">
													{Math.round(scale * 100)}%
												</span>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={
																handleZoomIn
															}
															disabled={
																scale >= 2
															}
														>
															<ZoomIn className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														Zoom In
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={
																handleReset
															}
														>
															<Maximize2 className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														Reset View
													</TooltipContent>
												</Tooltip>
											</div>
										</TooltipProvider>
										<TooltipProvider>
											<div className="flex items-center gap-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={handleSave}
															disabled={isSaving}
														>
															<Save className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														Save Changes
													</TooltipContent>
												</Tooltip>
											</div>
										</TooltipProvider>
										<NavActions
											user={user}
											signOut={signOut}
										/>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												setRightCollapsed(
													!rightCollapsed
												)
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
									className={
										"flex-1 overflow-auto w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 md:py-8 lg:py-12 space-y-8 md:space-y-10"
									}
								>
									<SubscriptionBanner />
									<TransformWrapper
										ref={transformRef}
										centerOnInit
										maxScale={2}
										minScale={0.4}
										initialScale={0.8}
										limitToBounds={false}
										wheel={{ wheelDisabled: wheelPanning }}
										panning={{ wheelPanning: wheelPanning }}
									>
										<TransformComponent
											wrapperClass="w-full h-full"
											contentClass="flex items-center justify-center"
										>
											{children}
										</TransformComponent>
									</TransformWrapper>
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
								rightCollapsed &&
									"min-w-0 max-w-0 p-0 opacity-0"
							)}
						>
							<RightSidebar />
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<div className="relative min-h-screen">
				<Sheet open={leftOpen} onOpenChange={setLeftOpen}>
					<SheetContent
						side="left"
						className="w-[80vw] sm:w-[350px] p-0"
					>
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
										<BreadcrumbLink href="/dashboard">
											Dashboard
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbItem>
										<BreadcrumbPage className="line-clamp-1">
											Portfolio Builder
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<div className="ml-auto flex items-center gap-2">
							<NavActions user={user} signOut={signOut} />
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
						<SubscriptionBanner />
						<TransformWrapper
							ref={transformRef}
							centerOnInit
							maxScale={2}
							minScale={0.4}
							initialScale={0.8}
							limitToBounds={false}
							wheel={{ wheelDisabled: wheelPanning }}
							panning={{ wheelPanning: wheelPanning }}
						>
							<TransformComponent
								wrapperClass="w-full h-full"
								contentClass="flex items-center justify-center"
							>
								<div>{children}</div>
							</TransformComponent>
						</TransformWrapper>
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
		</ProtectedRoute>
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
