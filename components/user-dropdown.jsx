"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { ProfileUpdate } from "./forms/profile-update";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

export const UserDropdown = ({ className }) => {
	const [error, setError] = useState(null);
	const {
		data: { user },
	} = useSession();

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
		} catch (error) {
			toast.error("Error signing out", {
				description: "There was a problem signing you out.",
			});
		}
	};

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							"relative h-8 w-8 rounded-full p-0",
							className
						)}
					>
						<Avatar>
							<AvatarImage
								src={user?.photoURL || undefined}
								alt={user?.displayName || "User avatar"}
							/>
							<AvatarFallback>
								{(user?.displayName?.[0] || "U").toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<DialogTrigger>Update profile</DialogTrigger>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleSignOut}>
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Profle</DialogTitle>
					<DialogDescription>
						Update your personal information and profile details
					</DialogDescription>
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</DialogHeader>
				<ProfileUpdate setError={setError} />
			</DialogContent>
		</Dialog>
	);
};
