"use client";

import {
	CopySimple,
	FolderOpen,
	Lock,
	LockOpen,
	PencilSimple,
	TrashSimple,
	Globe,
	Star,
} from "@phosphor-icons/react";
import { StarOff } from "lucide-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { BaseCard } from "./base-card";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
	updatePortfolioInDatabase,
	removePortfolioFromDatabase,
	addPortfolioInDatabase,
} from "@/redux/thunks/portfolio";
import { createId } from "@paralleldrive/cuid2";
import { useState, useEffect } from "react";
import { PortfolioDialog } from "@/components/dialogs/portfolio-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultPortfolio, portfolioSchema } from "@/schema/portfolio";
import { addPortfolio, updatePortfolio } from "@/redux/features/portfolioSlice";

export const PortfolioCard = ({ portfolio }) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const form = useForm({
		resolver: zodResolver(portfolioSchema),
		defaultValues: portfolio,
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

	const lastUpdated = dayjs(portfolio.updatedAt);

	const onOpen = () => {
		router.push(`/builder/${portfolio.id}`);
	};

	const onDuplicate = () => {
		const duplicatedPortfolio = {
			...portfolio,
			id: createId(), // Remove ID to create a new one
			name: `${portfolio.name} (Copy)`,
		};
		dispatch(addPortfolio(duplicatedPortfolio));
		dispatch(addPortfolioInDatabase(duplicatedPortfolio));
	};

	const onPublicChange = () => {
		dispatch(
			updatePortfolioInDatabase({
				id: portfolio.id,
				data: { isPublic: !portfolio.isPublic },
			})
		);
		dispatch(
			updatePortfolio({
				id: portfolio.id,
				data: { isPublic: !portfolio.isPublic },
			})
		);
	};

	const onPrimaryChange = () => {
		dispatch(
			updatePortfolioInDatabase({
				id: portfolio.id,
				data: { isPrimary: !portfolio.isPrimary },
			})
		);
		dispatch(
			updatePortfolio({
				id: portfolio.id,
				data: { isPrimary: !portfolio.isPrimary },
			})
		);
	};

	const onDelete = () => {
		dispatch(removePortfolioFromDatabase(portfolio.id));
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<BaseCard className="space-y-0" onClick={onOpen}>
					<AnimatePresence>
						{portfolio.locked && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm"
							>
								<Lock size={42} />
							</motion.div>
						)}
					</AnimatePresence>

					<div
						className={cn(
							"absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
							"bg-gradient-to-t from-background/80 to-transparent"
						)}
					>
						<h4 className="line-clamp-2 font-medium">
							{portfolio.name}
						</h4>
						<p className="line-clamp-1 text-xs opacity-75">{`Last updated ${lastUpdated}`}</p>
					</div>
				</BaseCard>
			</ContextMenuTrigger>

			<PortfolioDialog
				form={form}
				currentPortfolio={portfolio}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>

			<ContextMenuContent>
				<ContextMenuItem onClick={onOpen}>
					<FolderOpen size={14} className="mr-2" />
					{`Open`}
				</ContextMenuItem>
				<ContextMenuItem onClick={() => setIsOpen(true)}>
					<PencilSimple size={14} className="mr-2" />
					{`Rename`}
				</ContextMenuItem>
				<ContextMenuItem onClick={onDuplicate}>
					<CopySimple size={14} className="mr-2" />
					{`Duplicate`}
				</ContextMenuItem>
				<ContextMenuItem onClick={onPublicChange}>
					<Globe size={14} className="mr-2" />
					{portfolio.isPublic ? `Make Private` : `Make Public`}
				</ContextMenuItem>
				<ContextMenuItem onClick={onPrimaryChange}>
					{portfolio.isPrimary ? (
						<Star size={14} className="mr-2" />
					) : (
						<StarOff size={14} className="mr-2" />
					)}
					{portfolio.isPrimary ? `Unset Primary` : `Set as Primary`}
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem className="text-error" onClick={onDelete}>
					<TrashSimple size={14} className="mr-2" />
					{`Delete`}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
