import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { RichInput } from "@/components/ui/rich-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	addSkill,
	addSkillInDatabase,
	updateSkill,
	updateSkillnInDatabase,
} from "@/redux/features/skillSlice";

export const SkillDialog = ({ form, currentSkill, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentSkill) {
			dispatch(updateSkill({ id: currentSkill.id, ...data }));
			dispatch(updateSkillnInDatabase({ id: currentSkill.id, ...data }));
		} else {
			dispatch(addSkill(data));
			dispatch(addSkillInDatabase(data));
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
							name="description"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Description</label>
									<RichInput
										{...field}
										content={field.value}
										onChange={(value) =>
											field.onChange(value)
										}
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
