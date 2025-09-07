"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Loader2,
	AlertCircle,
	Check,
	Crown,
	Zap,
	Building,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import {
	getPlanTypeByProductId,
	SUBSCRIPTION_PLANS,
} from "@/utils/subscription-plans";
import {
	cancelSubscription,
	createCheckoutSession,
} from "@/services/subscription";

const planIcons = {
	FREE: null,
	BASIC: Zap,
	PRO: Crown,
	ENTERPRISE: Building,
};

const planColors = {
	FREE: "secondary",
	BASIC: "default",
	PRO: "default",
	ENTERPRISE: "default",
};

export function SubscriptionSettings() {
	const { user } = useAuth();
	const [isCancelling, setCancelling] = useState(false);
	const [isReactivating, setReactivating] = useState(false);
	const [isCreatingCheckout, setCreatingCheckout] = useState(false);

	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState(null);

	const subscription = user?.subscription || null;

	// Derive plan type/frequency from productId
	let planInfo = null;
	if (subscription && subscription.productId) {
		planInfo = getPlanTypeByProductId(subscription.productId);
	}

	const plans = ["FREE", "BASIC", "PRO"];

	const handleCancelSubscription = async () => {
		try {
			setCancelling(true);
			await cancelSubscription({ subscriptionId: subscription.id });
			toast.success("Subscription cancelled successfully");
			setShowCancelDialog(false);
		} catch (error) {
			toast.error(
				error?.data?.error?.message || "Failed to cancel subscription"
			);
		} finally {
			setCancelling(false);
		}
	};

	const handleReactivateSubscription = async () => {
		try {
			setReactivating(true);
			const result = await createCheckoutSession({
				userId: user.id,
				email: user.email,
				priceId: subscription.productId,
			});
			if (result.data?.checkoutSession?.url) {
				window.location.href = result.data.checkoutSession.url;
			}
		} catch (error) {
			toast.error(
				error?.data?.error?.message ||
					"Failed to reactivate subscription"
			);
		} finally {
			setReactivating(false);
		}
	};

	const handleUpgradePlan = async (plan) => {
		try {
			setCreatingCheckout(true);
			const result = await createCheckoutSession({
				userId: user.id,
				email: user.email,
				priceId: plan.priceId, // In a real app, you'd have separate price IDs
			});

			// Redirect to checkout
			if (result.data?.checkoutSession?.url) {
				window.location.href = result.data.checkoutSession.url;
			}
		} catch (error) {
			toast.error(
				error?.data?.error?.message ||
					"Failed to create checkout session"
			);
		} finally {
			setCreatingCheckout(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Current Subscription */}
			<Card>
				<CardHeader>
					<CardTitle>Current Subscription</CardTitle>
					<CardDescription>
						Manage your current subscription plan
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{subscription ? (
						<>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									{planIcons[planInfo.type] && (
										<div className="p-2 rounded-lg bg-primary/10">
											{(() => {
												const Icon =
													planIcons[planInfo.type];
												return Icon ? (
													<Icon className="h-5 w-5 text-primary" />
												) : null;
											})()}
										</div>
									)}
									<div>
										<h3 className="font-semibold">
											{planInfo.type} Plan
										</h3>
										<p className="text-sm text-muted-foreground">
											{subscription.amount !== 0
												? `$${(subscription.amount / 100).toFixed(2)}/month`
												: "Free"}
										</p>
									</div>
								</div>
								<Badge variant={planColors[planInfo.type]}>
									{subscription.status}
								</Badge>
							</div>

							{subscription.currentPeriodEnd && (
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										{subscription.cancelAtPeriodEnd
											? "Expires on:"
											: "Next billing date:"}
									</span>
									<span>
										{format(
											new Date(
												subscription.currentPeriodEnd
											),
											"MMMM dd, yyyy"
										)}
									</span>
								</div>
							)}

							{subscription.cancelAtPeriodEnd && (
								<Alert>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>
										Your subscription will be cancelled at
										the end of the current billing period.
										You can reactivate it anytime before
										then.
									</AlertDescription>
								</Alert>
							)}

							<div className="flex space-x-2">
								{subscription.status === "ACTIVE" &&
									!subscription.cancelAtPeriodEnd && (
										<Button
											variant="outline"
											onClick={() =>
												setShowCancelDialog(true)
											}
											disabled={isCancelling}
										>
											{isCancelling && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Cancel Subscription
										</Button>
									)}

								{subscription.cancelAtPeriodEnd && (
									<Button
										onClick={handleReactivateSubscription}
										disabled={isReactivating}
									>
										{isReactivating && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Reactivate Subscription
									</Button>
								)}

								<Button
									onClick={() => setShowUpgradeDialog(true)}
								>
									Change Plan
								</Button>
							</div>
						</>
					) : (
						<>
							<div className="text-center py-6">
								<h3 className="font-semibold mb-2">
									No Active Subscription
								</h3>
								<p className="text-muted-foreground mb-4">
									You&rsquo;re currently on the free plan.
								</p>
								<Button
									onClick={() => setShowUpgradeDialog(true)}
								>
									Upgrade Now
								</Button>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Available Plans */}
			<Card>
				<CardHeader>
					<CardTitle>Available Plans</CardTitle>
					<CardDescription>
						Choose the plan that best fits your needs
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{plans.map((planType) => {
							const plan =
								SUBSCRIPTION_PLANS[planType]["monthly"];
							const Icon = planIcons[planType];
							const isCurrentPlan =
								subscription?.productId === plan.priceId ||
								false;

							return (
								<Card
									key={planType}
									className={`relative ${isCurrentPlan ? "border-primary" : ""}`}
								>
									{isCurrentPlan && (
										<Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
											Current Plan
										</Badge>
									)}

									<CardHeader className="text-center pb-2">
										{Icon && (
											<div className="mx-auto p-2 rounded-lg bg-primary/10 w-fit">
												<Icon className="h-6 w-6 text-primary" />
											</div>
										)}
										<CardTitle className="text-lg">
											{plan.name}
										</CardTitle>
										<div className="text-2xl font-bold">
											${plan.price}
											<span className="text-sm font-normal text-muted-foreground">
												/{plan.interval}
											</span>
										</div>
									</CardHeader>

									<CardContent className="space-y-3">
										<ul className="space-y-2 text-sm">
											{plan.features.map(
												(feature, index) => (
													<li
														key={index}
														className="flex items-center space-x-2"
													>
														<Check className="h-4 w-4 text-primary flex-shrink-0" />
														<span>{feature}</span>
													</li>
												)
											)}
										</ul>

										{!isCurrentPlan && (
											<Button
												className="w-full"
												variant={
													plan.slug === "free"
														? "outline"
														: "default"
												}
												onClick={() => {
													setSelectedPlan(plan);
													if (plan.slug === "free") {
														// Handle downgrade to free
														setShowCancelDialog(
															true
														);
													} else {
														handleUpgradePlan(plan);
													}
												}}
												disabled={isCreatingCheckout}
											>
												{isCreatingCheckout && (
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												)}
												{plan.slug === "free"
													? "Downgrade"
													: "Upgrade"}
											</Button>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Cancel Subscription Dialog */}
			<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Subscription</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel your subscription?
							You&rsquo;ll continue to have access until the end
							of your current billing period.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end space-x-2">
						<Button
							variant="outline"
							onClick={() => setShowCancelDialog(false)}
						>
							Keep Subscription
						</Button>
						<Button
							variant="destructive"
							onClick={handleCancelSubscription}
							disabled={isCancelling}
						>
							{isCancelling && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Cancel Subscription
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Upgrade Dialog */}
			<Dialog
				open={showUpgradeDialog}
				onOpenChange={setShowUpgradeDialog}
			>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>Choose Your Plan</DialogTitle>
						<DialogDescription>
							Select the plan that best fits your needs. You can
							change or cancel anytime.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 py-4">
						{plans.map((planType) => {
							const plan =
								SUBSCRIPTION_PLANS[planType]["monthly"];
							const Icon = planIcons[planType];
							const isCurrentPlan =
								subscription?.productId === plan.priceId ||
								false;

							return (
								<Card
									key={planType}
									className={`relative ${selectedPlan?.slug === plan.slug ? "border-primary ring-2 ring-primary/20" : ""} ${isCurrentPlan ? "border-muted-foreground" : ""}`}
								>
									{isCurrentPlan && (
										<Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
											Current Plan
										</Badge>
									)}

									<CardHeader className="text-center pb-2">
										{Icon && (
											<div className="mx-auto p-2 rounded-lg bg-primary/10 w-fit">
												<Icon className="h-6 w-6 text-primary" />
											</div>
										)}
										<CardTitle className="text-lg">
											{plan.name}
										</CardTitle>
										<div className="text-2xl font-bold">
											${plan.price}
											<span className="text-sm font-normal text-muted-foreground">
												/{plan.interval}
											</span>
										</div>
									</CardHeader>

									<CardContent className="space-y-3">
										<ul className="space-y-2 text-sm">
											{plan.features.map(
												(feature, index) => (
													<li
														key={index}
														className="flex items-center space-x-2"
													>
														<Check className="h-4 w-4 text-primary flex-shrink-0" />
														<span>{feature}</span>
													</li>
												)
											)}
										</ul>

										{!isCurrentPlan && (
											<Button
												className="w-full"
												variant={
													selectedPlan?.slug ===
													plan.slug
														? "default"
														: "outline"
												}
												onClick={() => {
													setSelectedPlan(plan);
													if (plan.slug === "free") {
														// Handle downgrade to free
														setShowCancelDialog(
															true
														);
														setShowUpgradeDialog(
															false
														);
													} else {
														handleUpgradePlan(plan);
													}
												}}
												disabled={isCreatingCheckout}
											>
												{isCreatingCheckout &&
													selectedPlan?.slug ===
														plan.slug && (
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													)}
												{plan.slug === "free"
													? "Downgrade"
													: selectedPlan?.slug ===
														  plan.slug
														? "Selected"
														: "Select Plan"}
											</Button>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
					<div className="flex justify-end space-x-2">
						<Button
							variant="outline"
							onClick={() => {
								setShowUpgradeDialog(false);
								setSelectedPlan(null);
							}}
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
