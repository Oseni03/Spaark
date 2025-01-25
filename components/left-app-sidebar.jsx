"use client";

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

export function LeftAppSidebar() {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const Content = (
		<div className="grid gap-y-6 p-6">
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
			<Hackathon />
		</div>
	);

	if (isDesktop) {
		return <div className="h-screen overflow-y-auto">{Content}</div>;
	}

	return <ScrollArea className="h-screen">{Content}</ScrollArea>;
}
