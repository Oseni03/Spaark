import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn, logger } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import { useForm } from "react-hook-form";
import { defaultExperience, experienceSchema } from "@/schema/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ExperienceDialog } from "@/components/dialogs/experience-dialog";
import {
	addExperience,
	removeExperience,
	toggleExperienceVisibility,
} from "@/redux/features/portfolioSlice";
import {
	addExperienceInDatabase,
	removeExperienceFromDatabase,
	updateExperienceInDatabase,
} from "@/redux/thunks/experience";
import { createId } from "@paralleldrive/cuid2";
import { useParams } from "react-router-dom";

export const Experience = () => {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolio.items.find((item) => item.id === portfolioId)
	);
	const dispatch = useDispatch();
	const [currentExperience, setCurrentExperience] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(experienceSchema),
		defaultValues: defaultExperience,
	});
	const {
		reset,
		formState: { errors, defaultValues },
	} = form;

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.error("Form Validation Errors:", errors);
		}
	}, [errors, defaultValues]);

	// Access the specific section from the Redux state
	const section = portfolio?.experiences;
	if (!section) return null;

	// CRUD handlers
	const openCreateDialog = () => {
		reset({ ...defaultExperience, id: createId() });
		setCurrentExperience(null);
		setIsOpen(true);
	};
	const openUpdateDialog = (experience) => {
		logger.info("Update experience: ", experience);
		reset(experience);
		setCurrentExperience(experience);
		setIsOpen(true);
	};
	const onDuplicate = (item) => {
		const newItem = { ...item, id: createId() };

		dispatch(addExperience({ portfolioId, experience: newItem }));
		dispatch(addExperienceInDatabase({ ...newItem, portfolioId }));
	};
	const onDelete = (item) => {
		dispatch(
			removeExperience({
				experienceId: item.id,
				portfolioId,
			})
		);
		dispatch(
			removeExperienceFromDatabase({
				experienceId: item.id,
				portfolioId,
			})
		);
	};
	const onToggleVisibility = (item) => {
		dispatch(
			toggleExperienceVisibility({ portfolioId, experienceId: item.id })
		);
		dispatch(
			updateExperienceInDatabase({
				...item,
				visible: !item.visible,
				portfolioId,
			})
		);
	};

	return (
		<motion.section
			id={"experience"}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid gap-y-6"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">
						Experience
					</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				<ExperienceDialog
					form={form}
					currentExperience={currentExperience}
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
							title={item.company}
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
