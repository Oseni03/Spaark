import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import { removeProfile, toggleVisibility } from "@/redux/features/profileSlice";
import { ProfilesDialog } from "../dialogs/profile-dialog";

export const Profile = () => {
	const id = "profile";
	const dispatch = useDispatch();

	// Access the specific section from the Redux state
	const section = useSelector((state) => state.profile);

	if (!section) return null;

	// CRUD handlers
	const onCreate = () => console.log("Create new");
	const onUpdate = (item) => console.log("Update: ", item);
	const onDuplicate = (item) => console.log("Duplicate", item);
	const onDelete = (item) => dispatch(removeProfile(item.id));
	const onToggleVisibility = (item) => dispatch(toggleVisibility(item.id));

	return (
		<motion.section
			id={id}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid gap-y-6"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">Profile</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				{section.items.length === 0 && <ProfilesDialog />}

				<AnimatePresence>
					{section.items.map((item) => (
						<SectionListItem
							key={item.id}
							id={item.id}
							visible={item.visible}
							title={item.username}
							description={item.network}
							onUpdate={() => onUpdate(item)}
							onDelete={() => onDelete(item)}
							onDuplicate={() => onDuplicate(item)}
							onToggleVisibility={() => onToggleVisibility(item)}
						/>
					))}
				</AnimatePresence>
			</main>

			{section.items.length > 0 && (
				<footer className="flex items-center justify-end">
					<Button variant="outline" className="ml-auto gap-x-2">
						<Plus />
						<span>Add a new item</span>
					</Button>
				</footer>
			)}
		</motion.section>
	);
};
