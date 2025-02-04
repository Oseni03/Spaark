import { Skeleton } from "@/components/ui/skeleton";

const BlogPostSkeleton = () => {
	return (
		<article className="max-w-4xl mx-auto px-6 py-12">
			<div className="text-center mb-12">
				<div className="inline-block mb-6">
					<Skeleton className="w-12 h-12 rounded-full" />
				</div>
				<Skeleton className="h-12 w-3/4 mx-auto mb-8" />
			</div>

			<div className="mb-12">
				<div className="flex items-center gap-3 justify-center">
					<Skeleton className="h-5 w-32" />
					<div className="flex items-center gap-2">
						<Skeleton className="w-6 h-6 rounded-full" />
						<Skeleton className="h-5 w-24" />
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{/* Paragraphs */}
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-11/12" />
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-4/5" />
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-9/12" />
			</div>
		</article>
	);
};

export default BlogPostSkeleton;
