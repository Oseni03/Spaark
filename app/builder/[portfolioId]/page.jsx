"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { TemplateWrapper } from "@/components/templates/template-wrapper";
import { defaultBasics } from "@/schema/sections/basics";
import { CONTENT_CLASS } from "@/utils/constants";
import ProtectedRoute from "@/app/protected-route";

export default function Page() {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

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
		socials: portfolio?.socials?.items || [],
		blogEnabled: portfolio?.blogEnabled || false,
	};

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
