"use client";

import {
	CopySimple,
	FolderOpen,
	Lock,
	PencilSimple,
	TrashSimple,
	Globe,
	Star,
	Layout,
	FileText,
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
import { portfolioSchema } from "@/schema/sections";
import { logger } from "@/lib/utils";

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
			slug: `${portfolio.slug}-copy`,
		};
		dispatch(addPortfolioInDatabase(duplicatedPortfolio));
	};

	const onDelete = () => {
		dispatch(removePortfolioFromDatabase(portfolio.id));
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<BaseCard
					className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
					onClick={onOpen}
				>
					<AnimatePresence>
						{portfolio.locked && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm"
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
						<div className="mb-4">
							<div className="flex items-center gap-2 mb-2">
								<Layout className="w-5 h-5" />
								<h3 className="font-medium">
									{portfolio.name}
								</h3>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Globe className="w-4 h-4" />
								<span>
									{portfolio.customDomain || "No domain set"}
								</span>
							</div>
						</div>

						<div className="space-y-2 text-sm text-muted-foreground">
							<p>Template: {portfolio.template || "Default"}</p>
							{lastUpdated && (
								<p>
									Last updated:{" "}
									{lastUpdated.format("MMMM D, YYYY")}
								</p>
							)}
							<div className="flex items-center gap-2">
								<FileText className="w-4 h-4" />
								Blog:{" "}
								{portfolio.blogEnabled ? "Enabled" : "Disabled"}
							</div>
							{portfolio.organization && (
								<p className="text-xs">
									Organization: {portfolio.organization.name}
								</p>
							)}
						</div>
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
				<ContextMenuSeparator />
				<ContextMenuItem className="text-error" onClick={onDelete}>
					<TrashSimple size={14} className="mr-2" />
					{`Delete`}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
