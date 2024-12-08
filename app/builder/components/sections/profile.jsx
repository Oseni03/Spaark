import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import {
	removeProfile,
	removeProfileFromDatabase,
	toggleProfileVisibility,
	updateProfileInDatabase,
} from "@/redux/features/profileSlice";
import { ProfilesDialog } from "../dialogs/profile-dialog";
import { useForm } from "react-hook-form";
import { defaultProfile } from "@/schema/sections";
import { profileSchema } from "@/schema/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

export const Profile = () => {
	const dispatch = useDispatch();
	const [currentProfile, setCurrentProfile] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: defaultProfile,
	});
	const {
		reset,
		formState: { errors, defaultValues },
	} = form;

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form Validation Errors:", errors);
		}
	}, [errors, defaultValues]);

	// Access the specific section from the Redux state
	const section = useSelector((state) => state.profile);
	if (!section) return null;

	// CRUD handlers
	const openCreateDialog = () => {
		reset(defaultProfile);
		setCurrentProfile(null);
		setIsOpen(true);
	};
	const openUpdateDialog = (profile) => {
		reset(profile);
		setCurrentProfile(profile);
		setIsOpen(true);
	};
	const onDuplicate = (item) => console.log("Duplicate", item);
	const onDelete = (item) => {
		dispatch(removeProfile(item.id));
		dispatch(removeProfileFromDatabase(item.id));
	};
	const onToggleVisibility = (item) => {
		dispatch(toggleProfileVisibility(item.id));
		dispatch(updateProfileInDatabase(item.id, { visible: !item.visible }));
	};

	return (
		<motion.section
			id={"profile"}
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
				<ProfilesDialog
					form={form}
					currentProfile={currentProfile}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
				/>

				{section.items.length === 0 && (
					<Button
						onClick={openCreateDialog}
						variant="outline"
						className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
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
							title={item.username}
							description={item.network}
							onUpdate={() => openUpdateDialog(item)}
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
						onClick={openCreateDialog}
					>
						<Plus />
						<span>Add a new item</span>
					</Button>
				</footer>
			)}
		</motion.section>
	);
};
