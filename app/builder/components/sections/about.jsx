import { defaultSections } from "@/schema/sections";
import { RichInput } from "@/components/ui/rich-input";
import { cn } from "@/lib/utils";
// import { AiActions } from "@/client/components/ai-actions";
import { useState } from "react";

export const ABoutSection = () => {
	const [section, setSection] = useState(defaultSections.about);

	const updateSectionContent = (value) => {
		setSection((prevSection) => ({
			...prevSection,
			content: value,
		}));
	};

	return (
		<section id="about" className="grid gap-y-6">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">
						{section.name}
					</h2>
				</div>
			</header>
			<main className={cn(!section.visible && "opacity-50")}>
				<RichInput
					content={section.content}
					// footer={(editor) => (
					// 	<AiActions
					// 		value={editor.getText()}
					// 		onChange={editor.commands.setContent}
					// 	/>
					// )}
					onChange={updateSectionContent}
				/>
			</main>
		</section>
	);
};
