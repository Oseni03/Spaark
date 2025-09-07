import ModeToggle from "./mode-toggle";
import { UserDropdown } from "./user-dropdown";

export function NavActions() {
	return (
		<div className="flex items-center gap-2 text-sm">
			<ModeToggle />
			<UserDropdown />
		</div>
	);
}
