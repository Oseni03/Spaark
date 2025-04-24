import ModeToggle from "./mode-toggle";
import { UserDropdown } from "./user-dropdown";

export function NavActions({ user, signOut }) {
	return (
		<div className="flex items-center gap-2 text-sm">
			<ModeToggle />
			<UserDropdown user={user} signOut={signOut} />
		</div>
	);
}
