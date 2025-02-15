"use client";

import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BaseCard } from "./base-card";
import { useRouter } from "next/navigation";

export const CreateBlogCard = () => {
	const router = useRouter();
	return (
		<BaseCard onClick={() => router.push("/dashboard/blogs/new")}>
			<Plus size={64} weight="thin" />

			<div
				className={cn(
					"absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
					"bg-gradient-to-t from-background/80 to-transparent"
				)}
			>
				<h4 className="font-medium">
					{`Create a new post`}
					{/* <KeyboardShortcut className="ml-2">^N</KeyboardShortcut> */}
				</h4>

				<p className="text-xs opacity-75">{`Start a new post`}</p>
			</div>
		</BaseCard>
	);
};
