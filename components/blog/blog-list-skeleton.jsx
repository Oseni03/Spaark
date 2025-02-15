import { Skeleton } from "@/components/ui/skeleton";

const BlogListSkeleton = () => {
	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<Skeleton className="h-12 w-48 mb-8" /> {/* Title */}
			<div className="space-y-8">
				{[1, 2, 3].map((i) => (
					<article key={i} className="border-b pb-8">
						<Skeleton className="h-8 w-3/4 mb-2" />{" "}
						{/* Post title */}
						<Skeleton className="h-4 w-32 mb-4" /> {/* Date */}
						<Skeleton className="h-4 w-full mb-2" />{" "}
						{/* Excerpt line 1 */}
						<Skeleton className="h-4 w-5/6" />{" "}
						{/* Excerpt line 2 */}
					</article>
				))}
			</div>
		</div>
	);
};

export default BlogListSkeleton;
