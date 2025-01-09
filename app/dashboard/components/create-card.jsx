import { Plus } from "@phosphor-icons/react";
// import { KeyboardShortcut } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

import { BaseCard } from "./base-card";
import { useState } from "react";

export const CreateCard = () => {
	const [open, setOpen] = useState(false);

	return (
		<BaseCard>
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

				<p className="text-xs opacity-75">{`Start building from scratch`}</p>
			</div>
		</BaseCard>
	);
};
