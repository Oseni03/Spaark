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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import {
	getUserPortfolioLimit,
	getUserBlogLimit,
	hasPremiumFeatures,
	hasAnalyticsAccess,
} from "@/utils/subscription-plans";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/utils";

export function SubscriptionSettings() {
	const { user } = useAuth();
	const subscription = user?.subscription || null;

	const portfolioLimit = getUserPortfolioLimit(subscription);
	const blogLimit = getUserBlogLimit(subscription);
	const hasPremium = hasPremiumFeatures(subscription);
	const hasAnalytics = hasAnalyticsAccess(subscription);

	const formatLimit = (limit) => {
		if (limit === -1) return "Unlimited";
		if (limit === 0) return "Not available";
		return limit.toString();
	};

	const getPlanDisplayName = (type) => {
		switch (type) {
			case "FREE":
				return "Free";
			case "BASIC":
				return "Basic";
			case "PRO":
				return "Pro";
			default:
				return type || "Not Subscribed";
		}
	};

	const handleManageSubscription = async () => {
		try {
			await authClient.customer.portal();
		} catch (error) {
			logger.error("Failed to open customer portal:", error);
			toast.error("Failed to open subscription management");
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
						</p>
					</div>
					<div className="flex justify-start sm:justify-end">
						<Button
							variant="outline"
							onClick={handleManageSubscription}
						>
							<CreditCard className="mr-2 h-4 w-4" />
							Manage Subscription
						</Button>
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
