"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import { defaultBasics } from "@/schema/sections/basics";
import { CONTENT_CLASS } from "@/utils/constants";
import ProtectedRoute from "@/app/protected-route";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
	const { portfolioId } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);
	const [templateData, setTemplateData] = useState({
		basics: defaultBasics,
		projects: [],
		experiences: [],
		educations: [],
		skills: [],
		hackathons: [],
		certifications: [],
		socials: [],
		blogEnabled: false,
	});

	useEffect(() => {
		const loadPortfolio = async () => {
			try {
				setIsLoading(true);
				setError(null);

				if (!portfolio) {
					throw new Error("Portfolio not found");
				}

				setTemplateData({
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
					skills: (portfolio?.skills?.items || []).filter(
						(item) => item.visible
					),
					hackathons: (portfolio?.hackathons?.items || []).filter(
						(item) => item.visible
					),
					certifications: (
						portfolio?.certifications?.items || []
					).filter((item) => item.visible),
					socials: portfolio?.socials?.items || [],
					blogEnabled: portfolio?.blogEnabled || false,
				});
			} catch (err) {
				setError(err);
				toast({
					title: "Error loading portfolio",
					variant: "destructive",
					description: err.message,
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadPortfolio();
	}, [portfolio]);

	if (isLoading) {
		return (
			<div className="min-h-screen w-full">
				<div className={CONTENT_CLASS}>
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
						</div>
						<div className="grid grid-cols-2 gap-4 mt-8">
							<Skeleton className="h-32" />
							<Skeleton className="h-32" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen w-full">
				<div className={CONTENT_CLASS}>
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				</div>
			</div>
		);
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen w-full">
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
