import { UserButton } from "@clerk/nextjs";
import ModeToggle from "./mode-toggle";

export function NavActions() {
	return (
		<div className="flex items-center gap-2 text-sm">
			<ModeToggle />
			<UserButton />
		</div>
	);
}
