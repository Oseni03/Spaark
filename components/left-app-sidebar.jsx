"use client";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "./ui/separator";
import { BasicsSection } from "@/components/sections/basics";
import { Profile } from "@/components/sections/profile";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Skill } from "@/components/sections/skill";
import { Certification } from "@/components/sections/certification";
import { Project } from "@/components/sections/project";
import { Hackathon } from "@/components/sections/hackathon";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Testimonial } from "./sections/testimonial";
import { Team } from "./sections/team";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

export function LeftAppSidebar() {
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const { portfolioId } = useParams();

	// Get portfolio to check if it belongs to an organization
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);

	const isOrgPortfolio = Boolean(portfolio?.organizationId);

	const Content = (
		<div className="grid gap-y-6 p-6">
			<button
				onClick={() => router.push("/dashboard/portfolios")}
				className="flex items-center text-sm text-muted-foreground hover:text-primary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-2"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				Back to Portfolios
			</button>
			<BasicsSection />
			<Separator />
			<Profile />
			<Separator />
			<Experience />
			<Separator />
			<Education />
			<Separator />
			<Skill />
			<Separator />
			<Certification />
			<Separator />
			<Project />
			<Separator />
			{isOrgPortfolio && (
				<>
					<Team />
					<Separator />
				</>
			)}
			<Testimonial />
			<Separator />
			<Hackathon />
		</div>
	);

	if (isDesktop) {
		return <div className="h-screen overflow-y-auto">{Content}</div>;
	}

	return <ScrollArea className="h-screen">{Content}</ScrollArea>;
}
