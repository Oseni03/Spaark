import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addSkill, updateSkill } from "@/redux/features/skillSlice";

export const SkillDialog = ({ form, currentSkill, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentSkill) {
			dispatch(updateSkill({ id: currentSkill.id, ...data }));
		} else {
			dispatch(addSkill(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentSkill ? "Edit Skill" : "Add New Skill"}
					</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[70vh]">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 pr-3"
					>
						<Controller
							name="name"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Skill Name</label>
									<Input
										{...field}
										placeholder="Enter skill name"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="keywords"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Keywords</label>
									<Input
										placeholder="Enter keywords separated by commas"
										value={field.value.join(", ")} // Display as a string
										onChange={(e) => {
											const keywordsArray = e.target.value
												.split(",")
												.map((kw) => kw.trim());
											field.onChange(keywordsArray); // Update the array
										}}
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{currentSkill ? "Update Skill" : "Add Skill"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
