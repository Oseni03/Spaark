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
import { addSkill, updateSkill } from "@/redux/features/portfolioSlice";
import { logger } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { skillLevels } from "@/utils/constants";

export const SkillDialog = ({
	portfolioId,
	form,
	currentSkill,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentSkill) {
			logger.info("Update skill: ", currentSkill);
			logger.info("Update data: ", data);
			dispatch(
				updateSkill({
					...data,
					id: currentSkill.id,
					portfolioId,
				})
			);
		} else {
			dispatch(addSkill({ ...data, portfolioId }));
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
						<div className="grid md:grid-cols-2 space-y-4 md:space-y-0 gap-2">
							<Controller
								name="name"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Skill Name</label>
										<Input
											{...field}
											placeholder="Enter skill name"
										/>
										{fieldState.error && (
											<small className="text-red-500 opacity-75">
												{fieldState.error?.message}
											</small>
										)}
									</div>
								)}
							/>

							<Controller
								name="level"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Level</label>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select skill level" />
											</SelectTrigger>
											<SelectContent>
												{skillLevels.map(
													(level, idx) => (
														<SelectItem
															key={idx}
															value={level.value}
														>
															{level.label}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										{fieldState.error && (
											<small className="text-red-500 opacity-75">
												{fieldState.error?.message}
											</small>
										)}
									</div>
								)}
							/>
						</div>

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
									/>
									{fieldState.error && (
										<small className="text-red-500 opacity-75">
											{fieldState.error?.message}
										</small>
									)}
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
