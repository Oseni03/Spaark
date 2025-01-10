import {
	CopySimple,
	FolderOpen,
	Lock,
	LockOpen,
	PencilSimple,
	TrashSimple,
} from "@phosphor-icons/react";
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

export const BlogCard = ({ blog }) => {
	const router = useRouter();
	// Create a state management for open dialogs and blog management (Update, visible, delete, duplicate)

	const lastUpdated = dayjs().to(portfolio.updatedAt);

	const onOpen = () => {
		// Should a Shadcn drawer for viewing and updating the blog post
	};

	const onUpdate = () => {
		// open blog post update drawer
	};

	const onDuplicate = () => {
		// Duplicate blog post
	};

	const onVisible = () => {
		// toggle post visibility
	};

	const onDelete = () => {
		// delete blog post (delete dialog)
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<BaseCard className="space-y-0" onClick={onOpen}>
					<AnimatePresence>
						{blog.visible && (
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
							{blog.title}
						</h4>
						<p className="line-clamp-1 text-xs opacity-75">{`Last updated ${lastUpdated}`}</p>
					</div>
				</BaseCard>
			</ContextMenuTrigger>

			<ContextMenuContent>
				<ContextMenuItem onClick={onOpen}>
					<FolderOpen size={14} className="mr-2" />
					{`Open`}
				</ContextMenuItem>
				<ContextMenuItem onClick={onUpdate}>
					<PencilSimple size={14} className="mr-2" />
					{`Update`}
				</ContextMenuItem>
				<ContextMenuItem onClick={onDuplicate}>
					<CopySimple size={14} className="mr-2" />
					{`Duplicate`}
				</ContextMenuItem>
				{blog.visible ? (
					<ContextMenuItem onClick={onLockChange}>
						<LockOpen size={14} className="mr-2" />
						{`Show`}
					</ContextMenuItem>
				) : (
					<ContextMenuItem onClick={onLockChange}>
						<Lock size={14} className="mr-2" />
						{`Unshow`}
					</ContextMenuItem>
				)}
				<ContextMenuSeparator />
				<ContextMenuItem className="text-error" onClick={onDelete}>
					<TrashSimple size={14} className="mr-2" />
					{`Delete`}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
