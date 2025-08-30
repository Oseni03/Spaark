"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, Shield, Trash2, Key } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialog,
	AlertDialogTrigger,
} from "../ui/alert-dialog";

const passwordSchema = z
	.object({
		currentPassword: z.string().min(6, "Current password is required"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export function SecuritySettings() {
	const [error, setError] = useState(null);
	const [isChangingPassword, setChangingPassword] = useState(false);
	const [isDeletingAccount, setDeletingAccount] = useState(false);
	const [userAccounts, setUserAccounts] = useState([]);
	const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

	useEffect(() => {
		const loadAccounts = async () => {
			try {
				setIsLoadingAccounts(true);
				const accounts = await authClient.listAccounts();
				setUserAccounts(Array.isArray(accounts) ? accounts : []);
			} catch (err) {
				console.error("Failed to load linked accounts:", err);
				setUserAccounts([]);
			} finally {
				setIsLoadingAccounts(false);
			}
		};
		loadAccounts();
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(passwordSchema),
	});

	const onSubmit = async (data) => {
		try {
			setError(null);
			setChangingPassword(true);
			const { error } = await authClient.changePassword({
				newPassword: data.newPassword, // required
				currentPassword: data.currentPassword, // required
				revokeOtherSessions: true,
			});
			if (error) {
				throw new Error(error || "Failed to change password");
			}
			toast.success("Password changed successfully");
			reset();
		} catch (err) {
			const errorMessage = err?.message || "Failed to change password";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setChangingPassword(false);
		}
	};

	const sendDeleteConfirmationEmail = async () => {
		try {
			setDeletingAccount(true);
			setError(null);
			await authClient.deleteUser({
				callbackURL: "/goodbye",
			});
			toast.success("Account deletion verification email sent");
		} catch (err) {
			const errorMessage =
				err?.message || "Failed to initiate account deletion";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setDeletingAccount(false);
			setShowCancelDialog(false);
		}
	};

	const handleAccountUnlink = async (account) => {
		try {
			await authClient.unlinkAccount({
				providerId: account.provider,
				accountId: account.id,
			});
			// Refresh accounts list
			const accounts = await authClient.listAccounts();
			setUserAccounts(Array.isArray(accounts) ? accounts : []);
			toast.success("Account unlinked successfully");
		} catch (err) {
			toast.error(err.message || "Failed to unlink account");
		}
	};

	return (
		<div className="space-y-6">
			{/* Change Password */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Key className="h-5 w-5" />
						<span>Change Password</span>
					</CardTitle>
					<CardDescription>
						Update your password to keep your account secure
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="currentPassword">
								Current Password
							</Label>
							<Input
								id="currentPassword"
								type="password"
								{...register("currentPassword")}
								className={
									errors.currentPassword
										? "border-destructive"
										: ""
								}
								placeholder="Enter your current password"
							/>
							{errors.currentPassword && (
								<p className="text-sm text-destructive">
									{errors.currentPassword.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								type="password"
								{...register("newPassword")}
								className={
									errors.newPassword
										? "border-destructive"
										: ""
								}
								placeholder="Enter your new password"
							/>
							{errors.newPassword && (
								<p className="text-sm text-destructive">
									{errors.newPassword.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm New Password
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								{...register("confirmPassword")}
								className={
									errors.confirmPassword
										? "border-destructive"
										: ""
								}
								placeholder="Confirm your new password"
							/>
							{errors.confirmPassword && (
								<p className="text-sm text-destructive">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<Button type="submit" disabled={isChangingPassword}>
							{isChangingPassword && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Change Password
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Security Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Shield className="h-5 w-5" />
						<span>Security Information</span>
					</CardTitle>
					<CardDescription>
						Your account security status and recommendations
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<div className="flex items-center justify-between p-3 border rounded-lg">
							<div>
								<p className="font-medium">
									Two-Factor Authentication
								</p>
								<p className="text-sm text-muted-foreground">
									Add an extra layer of security to your
									account
								</p>
							</div>
							<Button variant="outline" size="sm">
								Enable 2FA
							</Button>
						</div>

						<div className="flex items-center justify-between p-3 border rounded-lg">
							<div>
								<p className="font-medium">
									Login Notifications
								</p>
								<p className="text-sm text-muted-foreground">
									Get notified when someone logs into your
									account
								</p>
							</div>
							<Button variant="outline" size="sm">
								Configure
							</Button>
						</div>

						<div className="flex items-center justify-between p-3 border rounded-lg">
							<div>
								<p className="font-medium">Active Sessions</p>
								<p className="text-sm text-muted-foreground">
									Manage devices that are logged into your
									account
								</p>
							</div>
							<Button variant="outline" size="sm">
								View Sessions
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			<AlertDialog>
				<Card className="border-destructive">
					<CardHeader>
						<CardTitle className="flex items-center space-x-2 text-destructive">
							<Trash2 className="h-5 w-5" />
							<span>Danger Zone</span>
						</CardTitle>
						<CardDescription>
							Irreversible and destructive actions
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Once you delete your account, there is no going
								back. Please be certain.
							</AlertDescription>
						</Alert>

						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Account
							</Button>
						</AlertDialogTrigger>
					</CardContent>
				</Card>

				{/* Delete Account Dialog */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Account</AlertDialogTitle>
						<AlertDialogDescription>
							<p>
								Are you absolutely sure you want to delete your
								account? This action cannot be undone. This will
								permanently delete your account and remove all
								of your data from our servers.
							</p>
							<p>
								Verification email will be sent to confirm your
								account deletion. This action cannot be undone.
							</p>
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="space-y-4">
						<div className="flex justify-end space-x-2">
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								type={"submiit"}
								onClick={sendDeleteConfirmationEmail}
							>
								{isDeletingAccount && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Send Verification Email
							</AlertDialogAction>
							{/* <Button
								variant="destructive"
								type="submit"
								disabled={isDeletingAccount}
							>
								{isDeletingAccount && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Send Verification Email
							</Button> */}
						</div>
					</div>
				</AlertDialogContent>
			</AlertDialog>

			{/* Linked Accounts */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Key className="h-5 w-5" />
						<span>Linked Accounts</span>
					</CardTitle>
					<CardDescription>
						Manage your connected accounts and authentication
						methods
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						{isLoadingAccounts ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-6 w-6 animate-spin" />
							</div>
						) : userAccounts.length > 0 ? (
							userAccounts.map((account) => (
								<div
									key={account.id}
									className="flex items-center justify-between p-3 border rounded-lg"
								>
									<div>
										<p className="font-medium capitalize">
											{account.provider}
										</p>
										<p className="text-sm text-muted-foreground">
											{account.providerAccountId}
										</p>
									</div>
									{userAccounts.length > 1 && (
										<Button
											variant="outline"
											size="sm"
											onClick={async () =>
												await handleAccountUnlink(
													account
												)
											}
										>
											Unlink
										</Button>
									)}
								</div>
							))
						) : (
							<div className="text-center py-4">
								<p className="text-sm text-muted-foreground">
									No linked accounts found
								</p>
							</div>
						)}

						<Button
							onClick={async () => {
								try {
									await authClient.linkSocial({
										provider: "google",
										callbackURL: "/settings",
									});
								} catch (err) {
									toast.error(
										err.message || "Failed to link account"
									);
								}
							}}
						>
							Link Google Account
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
