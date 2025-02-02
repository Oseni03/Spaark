"use client";

import { Separator } from "@/components/ui/separator";
import { SubscriptionSettings } from "./components/subscription-settings";

export default function SettingsPage() {
	return (
		<div className="w-full space-y-6">
			<div className="flex mx-auto max-w-3xl flex-col space-y-6">
				<div>
					<h3 className="text-lg font-medium">Settings</h3>
					<p className="text-sm text-muted-foreground">
						Manage your account settings and preferences.
					</p>
				</div>
				<Separator />
				<SubscriptionSettings />
			</div>
		</div>
	);
}
