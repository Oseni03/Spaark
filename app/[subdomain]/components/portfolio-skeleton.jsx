import { Skeleton } from "@/components/ui/skeleton";

const PortfolioSkeleton = () => {
	return (
		<>
			{/* Header section */}
			<div className="flex items-center justify-between">
				<div className="space-y-4">
					{/* Name skeleton */}
					<Skeleton className="h-12 w-48" />
					{/* Bio text skeleton */}
					<Skeleton className="h-4 w-60 md:w-96" />
				</div>
				{/* Profile picture skeleton - enhanced circular styling */}
				<Skeleton className="h-24 w-24 rounded-full ring-2 ring-offset-2" />
			</div>

			{/* About section */}
			<div className="space-y-4">
				<Skeleton className="h-8 w-24" /> {/* "About" header */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/6" />
				</div>
			</div>

			{/* Work Experience section */}
			<div className="space-y-6 mt-6">
				<Skeleton className="h-8 w-48" />{" "}
				{/* "Work Experience" header */}
				{/* Work items - repeating 4 times for each company */}
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex items-center space-x-4">
						<Skeleton className="h-12 w-12 rounded-full" />{" "}
						{/* Company logo */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />{" "}
							{/* Company name */}
							<Skeleton className="h-3 w-40" /> {/* Position */}
						</div>
						<div className="ml-auto">
							<Skeleton className="h-3 w-32" /> {/* Date range */}
						</div>
					</div>
				))}
			</div>
			{/* Education section */}
			<div className="space-y-6 mt-6">
				<Skeleton className="h-8 w-48" />{" "}
				{/* "Work Experience" header */}
				{/* Work items - repeating 4 times for each company */}
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex items-center space-x-4">
						<Skeleton className="h-12 w-12 rounded-full" />{" "}
						{/* Company logo */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />{" "}
							{/* Company name */}
							<Skeleton className="h-3 w-40" /> {/* Position */}
						</div>
						<div className="ml-auto">
							<Skeleton className="h-3 w-32" /> {/* Date range */}
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default PortfolioSkeleton;
