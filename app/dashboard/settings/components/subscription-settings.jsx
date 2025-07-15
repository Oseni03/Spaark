"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	CreditCard,
	Package,
	Books,
	Globe,
	ChartLine,
} from "@phosphor-icons/react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Pricing from "@/components/homepage/pricing";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import {
	getUserPortfolioLimit,
	getUserBlogLimit,
	isInTrialPeriod,
	hasPremiumFeatures,
	hasAnalyticsAccess,
} from "@/utils/subscription-plans";

export function SubscriptionSettings() {
	const { user } = useAuth();
	const subscription = user?.subscription || null;

	const portfolioLimit = getUserPortfolioLimit(subscription);
	const blogLimit = getUserBlogLimit(subscription);
	const inTrial = isInTrialPeriod(subscription);
	const hasPremium = hasPremiumFeatures(subscription);
	const hasAnalytics = hasAnalyticsAccess(subscription);

	const formatLimit = (limit) => {
		if (limit === -1) return "Unlimited";
		if (limit === 0) return "Not available";
		return limit.toString();
	};

	const getPlanDisplayName = (type) => {
		switch (type) {
			case "BASIC":
				return "Basic";
			case "PRO":
				return "Pro";
			case "CUSTOM":
				return "Custom";
			default:
				return type || "Not Subscribed";
		}
	};

	return (
		<Card>
			<div className="space-y-6 p-6">
				<div>
					<h3 className="text-lg font-medium">Subscription</h3>
					<p className="text-sm text-muted-foreground">
						Manage your subscription and billing information.
					</p>
				</div>
				<Separator />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
					<div className="space-y-1">
						<h4 className="font-medium flex items-center gap-2">
							<Package className="h-4 w-4" />
							Current Plan
						</h4>
						<p className="text-sm text-muted-foreground">
							{getPlanDisplayName(subscription?.type)}
							{inTrial && (
								<span className="ml-2 text-green-600 text-xs">
									(Trial)
								</span>
							)}
						</p>
					</div>
					<div className="flex justify-start sm:justify-end">
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline">
									<CreditCard className="mr-2 h-4 w-4" />
									Manage Subscription
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>
										Manage Your Subscription
									</DialogTitle>
								</DialogHeader>
								<Pricing
									isDialog={true}
									returnUrl={window.location.href}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{subscription && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Package className="h-4 w-4" />
								Portfolios
							</div>
							<p className="text-sm text-muted-foreground">
								{formatLimit(portfolioLimit)}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Books className="h-4 w-4" />
								Blog Articles
							</div>
							<p className="text-sm text-muted-foreground">
								{formatLimit(blogLimit)}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Globe className="h-4 w-4" />
								Custom Domain
							</div>
							<p className="text-sm text-muted-foreground">
								{hasPremium ? "Available" : "Basic only"}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<ChartLine className="h-4 w-4" />
								Analytics
							</div>
							<p className="text-sm text-muted-foreground">
								{hasAnalytics ? "Available" : "Not available"}
							</p>
						</div>
					</div>
				)}

				{subscription?.status === "active" && (
					<div className="text-sm text-muted-foreground">
						<p>
							Next billing:{" "}
							{subscription.endDate
								? new Date(
										subscription.endDate
									).toLocaleDateString()
								: "Not set"}
						</p>
					</div>
				)}
			</div>
		</Card>
	);
}
