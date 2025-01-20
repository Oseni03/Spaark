"use client";

import * as React from "react";
import {
	ArrowDown,
	ArrowUp,
	Bell,
	Copy,
	CornerUpLeft,
	CornerUpRight,
	FileText,
	GalleryVerticalEnd,
	LineChart,
	Link,
	MoreHorizontal,
	Settings2,
	Star,
	Trash,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import ModeToggle from "./mode-toggle";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { logger } from "@/lib/utils";

const data = [
	[
		{
			label: "Customize Page",
			icon: Settings2,
		},
		{
			label: "Turn into wiki",
			icon: FileText,
		},
	],
	[
		{
			label: "Copy Link",
			icon: Link,
		},
		{
			label: "Duplicate",
			icon: Copy,
		},
		{
			label: "Move to",
			icon: CornerUpRight,
		},
		{
			label: "Move to Trash",
			icon: Trash2,
		},
	],
	[
		{
			label: "Undo",
			icon: CornerUpLeft,
		},
		{
			label: "View analytics",
			icon: LineChart,
		},
		{
			label: "Version History",
			icon: GalleryVerticalEnd,
		},
		{
			label: "Show delete pages",
			icon: Trash,
		},
		{
			label: "Notifications",
			icon: Bell,
		},
	],
	[
		{
			label: "Import",
			icon: ArrowUp,
		},
		{
			label: "Export",
			icon: ArrowDown,
		},
	],
];

export function NavActions() {
	const [isOpen, setIsOpen] = React.useState(false);
	const user = useSelector((state) => state.user.data);

	function copyToClipboard() {
		if (!user.username) {
			toast.error("User username not found");
			return;
		}
		const text = `${user.username}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

		try {
			// Modern clipboard API
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard
					.writeText(text)
					.then(() => {
						toast.success("Copied to clipboard");
					})
					.catch((err) => {
						toast.error("Failed to copy");
						logger.error("Copy failed", err);
					});
			} else {
				// Fallback method
				const textArea = document.createElement("textarea");
				textArea.value = text;

				textArea.style.position = "fixed";
				textArea.style.left = "-999999px";
				textArea.style.top = "-999999px";
				document.body.appendChild(textArea);

				textArea.focus();
				textArea.select();

				try {
					const successful = document.execCommand("copy");
					if (successful) {
						toast.success("Copied to clipboard");
					} else {
						toast.error("Copy failed");
					}
				} catch (err) {
					toast.error("Copy failed");
					logger.error("Unable to copy", err);
				}

				document.body.removeChild(textArea);
			}
		} catch (err) {
			toast.error("Copy failed");
			logger.error("Copy error", err);
		}
	}

	// Example usage
	function handleCopy() {
		const textToCopy = "Hello, this is the text to be copied!";
		copyToClipboard(textToCopy);

		// Optional: Show user feedback
		alert("Text copied to clipboard!");
	}

	return (
		<div className="flex items-center gap-2 text-sm">
			<ModeToggle />
			<UserButton />
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 data-[state=open]:bg-accent"
					>
						<MoreHorizontal />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-56 overflow-hidden rounded-lg p-0"
					align="end"
				>
					<Sidebar collapsible="none" className="bg-transparent">
						<SidebarContent>
							<SidebarGroup className="border-b last:border-none">
								<SidebarGroupContent className="gap-0">
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												onClick={copyToClipboard}
											>
												<Link /> <span>Copy Link</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
				</PopoverContent>
			</Popover>
		</div>
	);
}
