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
	addEducation,
	addEducationInDatabase,
	updateEducation,
	updateEducationInDatabase,
} from "@/redux/features/educationSlice";
import { PictureSection } from "../sections/picture/section";

export const EducationDialog = ({
	form,
	currentEducation,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		if (currentEducation) {
			dispatch(updateEducation({ id: currentEducation.id, ...data }));
			dispatch(
				updateEducationInDatabase({ id: currentEducation.id, ...data })
			);
		} else {
			dispatch(addEducation(data));
			dispatch(addEducationInDatabase(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentEducation
							? "Edit Education"
							: "Add New Education"}
					</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[70vh]">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 pr-3"
					>
						<PictureSection control={control} setValue={setValue} />

						<div className="grid md:grid-cols-2 gap-2 space-y-4 md:space-y-0">
							<Controller
								name="institution"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Institution</label>
										<Input
											{...field}
											placeholder="Enter institution name"
											error={fieldState.error?.message}
										/>
									</div>
								)}
							/>

							<Controller
								name="studyType"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Type of Study</label>
										<Input
											{...field}
											placeholder="e.g., Bachelor's Degree"
											error={fieldState.error?.message}
										/>
									</div>
								)}
							/>

							<Controller
								name="area"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Area of Study</label>
										<Input
											{...field}
											placeholder="e.g., Computer Science"
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
						</div>

						<Controller
							name="url"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Website</label>
									<Input
										{...field}
										placeholder="Enter institution website"
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
								{currentEducation
									? "Update Education"
									: "Add Education"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
