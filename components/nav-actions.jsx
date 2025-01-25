"use client";

import * as React from "react";
import { Link, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { UserButton } from "@clerk/nextjs";
import ModeToggle from "./mode-toggle";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { logger } from "@/lib/utils";

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
					<div className="flex flex-col py-1">
						<Button
							variant="ghost"
							className="flex w-full items-center justify-start gap-2 rounded-none px-3 py-2 text-sm"
							onClick={copyToClipboard}
						>
							<Link className="h-4 w-4" />
							<span>Copy Link</span>
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
