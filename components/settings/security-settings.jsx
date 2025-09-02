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
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export function SecuritySettings() {
	const [error, setError] = useState(null);
	const [isDeletingAccount, setDeletingAccount] = useState(false);

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
		}
	};

	return (
		<div className="space-y-6">
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
								type={"submit"}
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
		</div>
	);
}
