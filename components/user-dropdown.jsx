"use client";

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

export const UserDropdown = ({ user, signOut, className }) => {
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
							src={user.photoURL || undefined}
							alt={user.displayName || "User avatar"}
						/>
						<AvatarFallback>
							{(user.displayName?.[0] || "U").toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleSignOut}>
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
