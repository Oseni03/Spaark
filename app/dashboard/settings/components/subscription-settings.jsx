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
	getSubscriptionData,
	getPlanTypeByProductId,
} from "@/utils/subscription-plans";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export function SubscriptionSettings() {
	const { user } = useAuth();
	const subscription = user?.subscription || null;
	const [portalLoading, setPortalLoading] = useState(false);

	// Derive plan type/frequency from productId
	let planInfo = null;
	let planData = null;
	if (subscription && subscription.productId) {
		planInfo = getPlanTypeByProductId(subscription.productId);
		if (planInfo) {
			planData = getSubscriptionData(planInfo.type, planInfo.frequency);
		}
	}

	// Fallback to Free plan if no active subscription or mapping
	if (!planData) {
		planData = getSubscriptionData("FREE", "monthly");
	}

	const formatLimit = (limit) => {
		if (limit === -1) return "Unlimited";
		if (limit === 0) return "Not available";
		return limit?.toString?.() || "Not available";
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
			setPortalLoading(true);
			if (!user) {
				toast.info("No user data");
				return;
			}
			await authClient.customer.portal({
				customerExternalId: user.id,
			});
		} catch (error) {
			logger.error("Failed to open customer portal:", error);
			toast.error("Failed to open subscription management");
		} finally {
			setPortalLoading(false);
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
							{getPlanDisplayName(planInfo?.type || "FREE")}
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

				{planData && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Package className="h-4 w-4" />
								Portfolios
							</div>
							<p className="text-sm text-muted-foreground">
								{formatLimit(planData.portfolioLimit)}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Books className="h-4 w-4" />
								Blog Articles
							</div>
							<p className="text-sm text-muted-foreground">
								{formatLimit(
									planData.blogLimit ||
										(planData.blogEnabled ? "Unlimited" : 0)
								)}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Globe className="h-4 w-4" />
								Custom Domain
							</div>
							<p className="text-sm text-muted-foreground">
								{planData.blogEnabled
									? "Available"
									: "Basic and Pro only"}
							</p>
						</div>

						{/* <div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<ChartLine className="h-4 w-4" />
								Analytics
							</div>
							<p className="text-sm text-muted-foreground">
								{planInfo?.type === "PRO"
									? "Available"
									: "Not available"}
							</p>
						</div> */}
					</div>
				)}

				{subscription?.status === "active" && (
					<div className="text-sm text-muted-foreground">
						<p>
							Next billing:{" "}
							{subscription.currentPeriodEnd
								? new Date(
										subscription.currentPeriodEnd
									).toLocaleDateString()
								: "Not set"}
						</p>
					</div>
				)}
			</div>
		</Card>
	);
}
