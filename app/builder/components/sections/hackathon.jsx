import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import { useForm } from "react-hook-form";
import { defaultHackathon, hackathonSchema } from "@/schema/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
	removeHackathon,
	toggleVisibility,
} from "@/redux/features/hackathonSlice";
import { HackathonDialog } from "../dialogs/hackathon-dialog";

export const Hackathon = () => {
	const dispatch = useDispatch();
	const [currentHackathon, setCurrentHackathon] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(hackathonSchema),
		defaultValues: defaultHackathon,
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
	const section = useSelector((state) => state.hackathon);
	if (!section) return null;

	// CRUD handlers
	const openCreateDialog = () => {
		reset(defaultHackathon);
		setCurrentHackathon(null);
		setIsOpen(true);
	};
	const openUpdateDialog = (hackathon) => {
		console.log("Update hackathon: ", hackathon);
		reset(hackathon);
		setCurrentHackathon(hackathon);
		setIsOpen(true);
	};
	const onDuplicate = (item) => console.log("Duplicate", item);
	const onDelete = (item) => dispatch(removeHackathon(item.id));
	const onToggleVisibility = (item) => dispatch(toggleVisibility(item.id));

	return (
		<motion.section
			id={"hackathon"}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid gap-y-6"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">
						Hackathon
					</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				<HackathonDialog
					form={form}
					currentHackathon={currentHackathon}
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
							title={item.name}
							description={item.date}
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
