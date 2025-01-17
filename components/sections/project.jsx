import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn, logger } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import { useForm } from "react-hook-form";
import { defaultProject, projectSchema } from "@/schema/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
	addProject,
	removeProject,
	toggleProjectVisibility,
} from "@/redux/features/portfolioSlice";
import {
	addProjectInDatabase,
	removeProjectFromDatabase,
	updateProjectInDatabase,
} from "@/redux/thunks/project";
import { ProjectDialog } from "@/components/dialogs/project-dialog";
import { createId } from "@paralleldrive/cuid2";
import { useParams } from "next/navigation";

export const Project = () => {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);
	const dispatch = useDispatch();
	const [currentProject, setCurrentProject] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(projectSchema),
		defaultValues: { ...defaultProject, id: createId() },
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
	const section = portfolio?.projects;
	if (!section) return null;

	// CRUD handlers
	const openCreateDialog = () => {
		reset({ ...defaultProject, id: createId() });
		setCurrentProject(null);
		setIsOpen(true);
	};
	const openUpdateDialog = (project) => {
		reset(project);
		setCurrentProject(project);
		setIsOpen(true);
	};
	const onDuplicate = (item) => {
		const newItem = { ...item, id: createId() };

		dispatch(addProject({ portfolioId, project: newItem }));
		dispatch(addProjectInDatabase({ ...newItem, portfolioId }));
	};
	const onDelete = (item) => {
		dispatch(
			removeProject({
				projectId: item.id,
				portfolioId,
			})
		);
		dispatch(
			removeProjectFromDatabase({
				projectId: item.id,
				portfolioId,
			})
		);
	};
	const onToggleVisibility = (item) => {
		dispatch(toggleProjectVisibility({ portfolioId, projectId: item.id }));
		dispatch(
			updateProjectInDatabase({
				...item,
				visible: !item.visible,
				portfolioId,
			})
		);
	};

	return (
		<motion.section
			id={"project"}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid gap-y-6"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">Project</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				<ProjectDialog
					form={form}
					currentProject={currentProject}
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
