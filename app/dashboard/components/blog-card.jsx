import {
	CopySimple,
	FolderOpen,
	Lock,
	LockOpen,
	PencilSimple,
	TrashSimple,
	CloudArrowUp,
	CloudX,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	removeBlogFromDatabase,
	updateBlogInDatabase,
	createBlogInDatabase,
} from "@/redux/thunks/blog";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn, logger } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { BaseCard } from "./base-card";
import { useRouter } from "next/navigation";

// Initialize the relative time plugin
dayjs.extend(relativeTime);

export const BlogCard = ({ blog }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const formattedDate = dayjs(new Date(blog.updatedAt)).fromNow();

	const onOpen = () => {
		router.push(`/dashboard/blogs/${blog.id}`);
	};

	const onUpdate = () => {
		router.push(`/dashboard/blogs/${blog.id}/edit`);
	};

	const onDuplicate = async () => {
		try {
			const result = await dispatch(
				createBlogInDatabase({
					portfolioId: blog.portfolioId,
					data: {
						title: `${blog.title} (Copy)`,
						slug: `${blog.slug}-copy`,
						excerpt: blog.excerpt || "",
						content: blog.content,
						featuredImage: blog.featuredImage,
						status: "draft",
						tags: blog.tags?.map((tag) => tag.name) || [],
					},
				})
			).unwrap();

			if (result.error) {
				throw new Error(result.error);
			}

			toast.success("Blog post duplicated successfully");
		} catch (error) {
			toast.error(error.message || "Failed to duplicate the blog post");
			logger.error("Blog duplication error:", error);
		}
	};

	const onDelete = async () => {
		setDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		try {
			const result = await dispatch(
				removeBlogFromDatabase({
					blogId: blog.id,
					portfolioId: blog.portfolioId,
				})
			).unwrap();

			if (result.error) {
				throw new Error(result.error);
			}

			toast.success("Blog post deleted successfully");
		} catch (error) {
			toast.error(error.message || "Failed to delete the blog post");
		} finally {
			setDeleteDialogOpen(false);
		}
	};

	const onPublish = async () => {
		try {
			const result = await dispatch(
				updateBlogInDatabase({
					blogId: blog.id,
					portfolioId: blog.portfolioId,
					data: {
						status: blog.status === "draft" ? "published" : "draft",
						publishedAt:
							blog.status === "draft" ? new Date() : null,
					},
				})
			).unwrap();

			if (result.error) {
				throw new Error(result.error);
			}

			toast.success(
				`Blog post ${blog.status === "draft" ? "published" : "unpublished"} successfully`
			);
		} catch (error) {
			toast.error(
				error.message ||
					`Failed to ${blog.status === "draft" ? "publish" : "unpublish"} the blog post`
			);
		}
	};

	if (!blog) return;

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger>
					<BaseCard className="space-y-0" onClick={onOpen}>
						<AnimatePresence>
							{blog.status === "draft" && (
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
					{/* <ContextMenuItem onClick={onDuplicate}>
						<CopySimple size={14} className="mr-2" />
						{`Duplicate`}
					</ContextMenuItem> */}
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

			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete the blog post.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
