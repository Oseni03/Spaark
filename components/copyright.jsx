import { cn } from "@/lib/utils";

export const Copyright = ({ className }) => (
	<div
		className={cn(
			"prose prose-sm prose-zinc flex max-w-none flex-col gap-y-1 text-xs opacity-40 dark:prose-invert",
			className
		)}
	>
		<span>
			Licensed under{" "}
			<a
				target="_blank"
				rel="noopener noreferrer nofollow"
				href="https://github.com/AmruthPillai/Reactive-Resume/blob/main/LICENSE.md"
			>
				MIT
			</a>
		</span>
		<span>By the community, for the community.</span>
		<span>
			A passion project by{" "}
			<a href="https://www.amruthpillai.com/">Amruth Pillai</a>
		</span>

		<span className="mt-4">Reactive Resume v{1}</span>
	</div>
);
