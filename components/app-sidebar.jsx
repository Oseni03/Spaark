"use client";

import * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { BasicsSection } from "@/components/sections/basics";
import { Profile } from "@/components/sections/profile";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Skill } from "@/components/sections/skill";
import { Certification } from "@/components/sections/certification";
import { Project } from "@/components/sections/project";
import { Hackathon } from "@/components/sections/hackathon";

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
