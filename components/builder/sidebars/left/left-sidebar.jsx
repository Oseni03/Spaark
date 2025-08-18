"use client";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BasicsSection } from "./sections/basics";
import { Social } from "./sections/social";
import { Experience } from "./sections/experience";
import { Education } from "./sections/education";
import { Skill } from "./sections/skill";
import { Certification } from "./sections/certification";
import { Project } from "./sections/project";
import { Hackathon } from "./sections/hackathon";
import { useMediaQuery } from "@/hooks/use-media-query";

export function LeftSidebar() {
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1024px)");

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
			<Social />
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
			<Hackathon />
		</div>
	);

	if (isDesktop) {
		return <div className="h-screen overflow-y-auto">{Content}</div>;
	}

	return <ScrollArea className="h-screen">{Content}</ScrollArea>;
}
