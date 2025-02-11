"use client";

import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { CreditCard, Package } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Pricing from "@/components/homepage/pricing";

export function SubscriptionSettings() {
	const subscription = useSelector((state) => state.user.subscription);

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Subscription</h3>
				<p className="text-sm text-muted-foreground">
					Manage your subscription and billing information.
				</p>
			</div>

			<Card className="p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h4 className="font-medium flex items-center gap-2">
							<Package className="h-4 w-4" />
							Current Plan
						</h4>
						<p className="text-sm text-muted-foreground">
							{subscription?.plan || "Not Subscribed"}
						</p>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">
								<CreditCard className="mr-2 h-4 w-4" />
								Manage Subscription
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
							<Pricing
								isDialog={true}
								returnUrl={window.location.href}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</Card>
		</div>
	);
}
