import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn, logger } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { SectionListItem } from "./shared/section-list-item";
import { useForm } from "react-hook-form";
import { defaultTestimonial, testimonialSchema } from "@/schema/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
	addTestimonialInDatabase,
	removeTestimonialFromDatabase,
	updateTestimonialInDatabase,
} from "@/redux/thunks/testimonials";
import { TestimonialDialog } from "@/components/dialogs/testimonial-dialog";
import { createId } from "@paralleldrive/cuid2";
import { useParams } from "next/navigation";

export const Testimonial = () => {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);
	const dispatch = useDispatch();
	const [currentTestimonial, setCurrentTestimonial] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(testimonialSchema),
		defaultValues: defaultTestimonial,
	});
	const {
		reset,
		formState: { errors, defaultValues },
	} = form;

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.error("Form Validation Errors:", errors);
		}
	}, [errors, defaultValues]);

	const section = portfolio?.testimonials;
	if (!section) return null;

	// CRUD handlers
	const openCreateDialog = () => {
		reset({ ...defaultTestimonial, id: createId() });
		setCurrentTestimonial(null);
		setIsOpen(true);
	};
	const openUpdateDialog = (testimonial) => {
		reset(testimonial);
		setCurrentTestimonial(testimonial);
		setIsOpen(true);
	};
	const onDuplicate = (item) => {
		dispatch(
			addTestimonialInDatabase({ ...item, id: createId(), portfolioId })
		);
	};
	const onDelete = (item) => {
		dispatch(
			removeTestimonialFromDatabase({
				testimonialId: item.id,
				portfolioId,
			})
		);
	};
	const onToggleVisibility = (item) => {
		dispatch(
			updateTestimonialInDatabase({
				...item,
				visible: !item.visible,
				portfolioId,
			})
		);
	};

	return (
		<motion.section
			id={"testimonial"}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid gap-y-6"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">
						Testimonials
					</h2>
				</div>
			</header>

			<main
				className={cn(
					"grid transition-opacity",
					!section?.visible && "opacity-50"
				)}
			>
				<TestimonialDialog
					portfolioId={portfolioId}
					form={form}
					currentTestimonial={currentTestimonial}
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
							description={`${item.role}${item.company ? ` at ${item.company}` : ""}`}
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
