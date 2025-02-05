import {
	CopySimple,
	FolderOpen,
	Lock,
	LockOpen,
	PencilSimple,
	TrashSimple,
	CloudArrowUp, // Add this
	CloudX, // Add this
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
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";

import { BaseCard } from "./base-card";
import { useRouter } from "next/navigation";

// Initialize the relative time plugin
dayjs.extend(relativeTime);

export const BlogCard = ({ blog }) => {
	const router = useRouter();
	// Create a state management for open dialogs and blog management (Update, visible, delete, duplicate)

	const formattedDate = dayjs(blog.updatedAt).fromNow(); // Change .to() to .fromNow()

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

	const onPublish = () => {
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
						<p className="line-clamp-1 text-xs opacity-75">{`Last updated ${formattedDate}`}</p>
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
				{blog.status == "draft" ? (
					<ContextMenuItem onClick={onPublish}>
						<CloudArrowUp size={14} className="mr-2" />
						{`Publish`}
					</ContextMenuItem>
				) : (
					<ContextMenuItem onClick={onPublish}>
						<CloudX size={14} className="mr-2" />
						{`Unpublish`}
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
