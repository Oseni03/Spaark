import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { SectionListItem } from "./shared/section-list-item";
import { Profile as ProfileSchema } from "@/schema/sections";
import { removeProfile, toggleVisibility } from "@/redux/features/profileSlice";

export const Profile = () => {
	const id = "profile";
	const dispatch = useDispatch();

	// Access the specific section from the Redux state
	const section = useSelector((state) => state.portfolio.profiles);

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
					<h2 className="line-clamp-1 text-3xl font-bold">{id}</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				{section.items.length === 0 && (
					<Button
						variant="outline"
						className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
						onClick={onCreate}
					>
						<Plus size={14} />
						<span className="font-medium">Add a new item</span>
					</Button>
				)}

				<AnimatePresence>
					{section.items.map((item) => (
						<SectionListItem
							key={item.id}
							id={item.id}
							visible={item.visible}
							title={`Profiles`}
							description={`Description`}
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
					<Button
						variant="outline"
						className="ml-auto gap-x-2"
						onClick={onCreate}
					>
						<Plus />
						<span>Add a new item</span>
					</Button>
				</footer>
			)}
		</motion.section>
	);
};
