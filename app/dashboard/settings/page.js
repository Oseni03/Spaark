"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionSettings } from "@/components/settings/subscription-settings";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { SecuritySettings } from "@/components/settings/security-settings";

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="subscription">Subscription</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="space-y-6">
					<ProfileSettings />
				</TabsContent>

				<TabsContent value="subscription" className="space-y-6">
					<SubscriptionSettings />
				</TabsContent>

				<TabsContent value="security" className="space-y-6">
					<SecuritySettings />
				</TabsContent>
			</Tabs>
		</div>
	);
}
