import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
	// arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useDialog } from "@/client/stores/dialog";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
	// addItem,
	// updateItem,
	removeItem,
	toggleItemVisibility,
	reorderItems,
} from "@/redux/store";
import { SectionListItem } from "./section-list-item";
import { SectionOptions } from "./section-options";

export const SectionBase = ({ id, title, description }) => {
	const { open } = useDialog(id);
	const dispatch = useDispatch();

	// Access the specific section from the Redux state
	const section = useSelector((state) => state.portfolio[id]);

	// Configure sensors for drag-and-drop
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	if (!section) return null;

	// Handle drag-and-drop sorting
	const onDragEnd = (event) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id !== over.id) {
			const oldIndex = section.findIndex((item) => item.id === active.id);
			const newIndex = section.findIndex((item) => item.id === over.id);

			dispatch(
				reorderItems({
					section: id,
					oldIndex,
					newIndex,
				})
			);
		}
	};

	// CRUD handlers
	const onCreate = () => open("create", { id });
	const onUpdate = (item) => open("update", { id, item });
	const onDuplicate = (item) => open("duplicate", { id, item });
	const onDelete = (item) =>
		dispatch(removeItem({ section: id, id: item.id }));
	const onToggleVisibility = (itemId) =>
		dispatch(toggleItemVisibility({ section: id, id: itemId }));

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
				<div className="flex items-center gap-x-2">
					<SectionOptions id={id} />
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				{section.length === 0 && (
					<Button
						variant="outline"
						className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
						onClick={onCreate}
					>
						<Plus size={14} />
						<span className="font-medium">
							{t("Add a new item", {
								context:
									"For example, add a new work experience or profile.",
							})}
						</span>
					</Button>
				)}

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					modifiers={[restrictToParentElement]}
					onDragEnd={onDragEnd}
				>
					<SortableContext
						items={section}
						strategy={verticalListSortingStrategy}
					>
						<AnimatePresence>
							{section.map((item, index) => (
								<SectionListItem
									key={item.id}
									id={item.id}
									visible={item.visible}
									title={title(item)}
									description={description?.(item)}
									onUpdate={() => onUpdate(item)}
									onDelete={() => onDelete(item)}
									onDuplicate={() => onDuplicate(item)}
									onToggleVisibility={() =>
										onToggleVisibility(item.id)
									}
								/>
							))}
						</AnimatePresence>
					</SortableContext>
				</DndContext>
			</main>

			{section.length > 0 && (
				<footer className="flex items-center justify-end">
					<Button
						variant="outline"
						className="ml-auto gap-x-2"
						onClick={onCreate}
					>
						<Plus />
						<span>
							{t("Add a new item", {
								context:
									"For example, add a new work experience or profile.",
							})}
						</span>
					</Button>
				</footer>
			)}
		</motion.section>
	);
};
