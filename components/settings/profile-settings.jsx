"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
});

export function ProfileSettings() {
	const { user } = useAuth();
	const [error, setError] = (useState < string) | (null > null);
	const [isUpdating, setIsUpdating] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
		},
	});

	const onSubmit = async (data) => {
		try {
			setIsUpdating(true);
			setError(null);
			if (data.email !== user.email) {
				await authClient.changeEmail({
					newEmail: data.newPassword,
					callbackURL: "/dashboard/settings", //to redirect after verification
				});
			}
			await authClient.updateUser({
				name: data.name,
			});
			toast.success("Profile updated successfully");
		} catch (err) {
			const errorMessage =
				err?.data?.error?.message || "Failed to update profile";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Profile Information */}
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your personal information and profile details
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Avatar Section */}
					<div className="flex items-center space-x-4">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={user?.avatar || "/placeholder.svg"}
								alt={user?.name || user?.email}
							/>
							<AvatarFallback className="text-lg">
								{user?.name
									? user.name.charAt(0).toUpperCase()
									: user?.email?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<Button variant="outline" size="sm">
								<Camera className="mr-2 h-4 w-4" />
								Change Avatar
							</Button>
							<p className="text-xs text-muted-foreground">
								JPG, GIF or PNG. 1MB max.
							</p>
						</div>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									{...register("name")}
									className={
										errors.name ? "border-destructive" : ""
									}
									placeholder="Enter your full name"
								/>
								{errors.name && (
									<p className="text-sm text-destructive">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									{...register("email")}
									className={
										errors.email ? "border-destructive" : ""
									}
									placeholder="Enter your email address"
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>

						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={!isDirty || isUpdating}
							>
								{isUpdating && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Save Changes
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Account Information */}
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
					<CardDescription>
						View your account details and status
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<Label className="text-sm font-medium">
								User ID
							</Label>
							<p className="text-sm text-muted-foreground font-mono">
								{user?.id}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium">
								Account Type
							</Label>
							<p className="text-sm text-muted-foreground">
								{user?.role}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium">
								Member Since
							</Label>
							<p className="text-sm text-muted-foreground">
								{user?.createdAt
									? new Date(
											user.createdAt
										).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium">
								Last Updated
							</Label>
							<p className="text-sm text-muted-foreground">
								{user?.updatedAt
									? new Date(
											user.updatedAt
										).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
