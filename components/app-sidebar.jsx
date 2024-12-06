"use client";

import * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { BasicsSection } from "@/app/builder/components/sections/basics";
import { Profile } from "@/app/builder/components/sections/profile";
import { Experience } from "@/app/builder/components/sections/experience";
import { Education } from "@/app/builder/components/sections/education";
import { Skill } from "@/app/builder/components/sections/skill";
import { Certification } from "@/app/builder/components/sections/certification";
import { Project } from "@/app/builder/components/sections/project";
import { Hackathon } from "@/app/builder/components/sections/hackathon";

export function AppSidebar({ ...props }) {
	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarContent>
				<div className="grid gap-y-6 p-6 @container/left">
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
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
