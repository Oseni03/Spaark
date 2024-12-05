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
import { RichInput } from "@/components/ui/rich-input";
import {
	addExperience,
	updateExperience,
} from "@/redux/features/experienceSlice";

export const ExperienceDialog = ({
	form,
	currentExperience,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentExperience) {
			dispatch(updateExperience({ id: currentExperience.id, ...data }));
		} else {
			dispatch(addExperience(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentExperience
							? "Edit Experience"
							: "Add New Experience"}
					</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[70vh]">
					{" "}
					{/* Add a scroll area with a max height */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 pr-3"
					>
						<Controller
							name="company"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Company</label>
									<Input
										{...field}
										placeholder="Enter company name"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="position"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Position</label>
									<Input
										{...field}
										placeholder="Enter your position"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="date"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Date or Date Range</label>
									<Input
										{...field}
										placeholder="e.g., March 2023 - Present"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="location"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Location</label>
									<Input
										{...field}
										placeholder="Enter location"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="url"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Website</label>
									<Input
										{...field}
										placeholder="Enter company website"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="summary"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Summary</label>
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
								{currentExperience
									? "Update Experience"
									: "Add Experience"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};