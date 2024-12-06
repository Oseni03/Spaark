import { useSelector, useDispatch } from "react-redux";
import { RichInput } from "@/components/ui/rich-input";
// import { AiActions } from "@/client/components/ai-actions";
import { updateSummary } from "@/redux/features/summarySlice";

export const SummarySection = () => {
	const dispatch = useDispatch();
	const content = useSelector((state) => state.summary.content);

	const updateSectionContent = (value) => {
		dispatch(updateSummary(value));
	};

	return (
		<section id="summary" className="grid gap-y-6">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">Summary</h2>
				</div>
			</header>
			<main>
				<RichInput
					content={content}
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
