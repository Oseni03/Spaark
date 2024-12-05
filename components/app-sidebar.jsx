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
import { SummarySection } from "@/app/builder/components/sections/summary";
import { ABoutSection } from "@/app/builder/components/sections/about";
import { Profile } from "@/app/builder/components/sections/profile";
import { Experience } from "@/app/builder/components/sections/experience";
import { Education } from "@/app/builder/components/sections/education";
import { Skill } from "@/app/builder/components/sections/skill";

export function AppSidebar({ ...props }) {
	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarContent>
				<div className="grid gap-y-6 p-6 @container/left">
					<BasicsSection />
					<Separator />
					<SummarySection />
					<Separator />
					<ABoutSection />
					<Separator />
					<Profile />
					<Separator />
					<Experience />
					<Separator />
					<Education />
					<Separator />
					<Skill />
				</div>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
