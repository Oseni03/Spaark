"use client";

import { BlogSettings } from "./blog-settings";
import { DomainSettings } from "./domain-settings";
import { Separator } from "./ui/separator";

export function SettingsTab() {
	return (
		<div className="space-y-6">
			<DomainSettings />
			<Separator />
			<BlogSettings />
			<Separator />
		</div>
	);
}
