import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BaseCard } from "./base-card";

export const CreatePortfolioCard = () => {
	const onClick = () => {
		console.log("Create portfolio clicked");
	};
	return (
		<BaseCard onClick={onClick}>
			<Plus size={64} weight="thin" />

			<div
				className={cn(
					"absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
					"bg-gradient-to-t from-background/80 to-transparent"
				)}
			>
				<h4 className="font-medium">
					{`Create a new portfolio`}
					{/* <KeyboardShortcut className="ml-2">^N</KeyboardShortcut> */}
				</h4>

				<p className="text-xs opacity-75">{`Start a new presentation`}</p>
			</div>
		</BaseCard>
	);
};
