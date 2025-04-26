"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import { defaultBasics } from "@/schema/sections/basics";
import { useState } from "react";
import { CONTAINER_CLASS, CONTENT_CLASS } from "@/utils/constants";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/app/protected-route";

export default function Page() {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);
	const user = useSelector((state) => state.user.data);
	const [showBanner, setShowBanner] = useState(true);

	const templateData = {
		basics: portfolio?.basics || defaultBasics,
		projects: (portfolio?.projects?.items || []).filter(
			(item) => item.visible
		),
		experiences: (portfolio?.experiences?.items || []).filter(
			(item) => item.visible
		),
		educations: (portfolio?.educations?.items || []).filter(
			(item) => item.visible
		),
		skills: (portfolio?.skills?.items || []).filter((item) => item.visible),
		hackathons: (portfolio?.hackathons?.items || []).filter(
			(item) => item.visible
		),
		certifications: (portfolio?.certifications?.items || []).filter(
			(item) => item.visible
		),
		profiles: portfolio?.profiles?.items || [],
		blogEnabled: portfolio?.blogEnabled || false,
	};

	return (
		<ProtectedRoute>
			<div className="min-h-screen w-full">
				{!(user?.subscription?.status === "active") && showBanner && (
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
				)}

				<div className={CONTENT_CLASS}>
					<TemplateWrapper
						template={portfolio?.template || "default"}
						data={templateData}
						className="h-[calc(100vh-120px)]"
					/>
				</div>
			</div>
		</ProtectedRoute>
	);
}
