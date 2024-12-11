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
	addHackathon,
	addHackathonInDatabase,
	updateHackathon,
	updateHackathonnInDatabase,
} from "@/redux/features/hackathonSlice";
import { PictureSection } from "../sections/picture/section";
import { CustomLink } from "@/components/custom-link";

export const HackathonDialog = ({
	form,
	currentHackathon,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		if (currentHackathon) {
			dispatch(updateHackathon({ id: currentHackathon.id, ...data }));
			dispatch(
				updateHackathonnInDatabase({ id: currentHackathon.id, ...data })
			);
		} else {
			dispatch(addHackathon(data));
			dispatch(addHackathonInDatabase(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentHackathon
							? "Edit Hackathon"
							: "Add New Hackathon"}
					</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[70vh]">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 pr-3"
					>
						<PictureSection
							control={control}
							setValue={setValue}
							name={"logo"}
						/>
						<div className="grid md:grid-cols-2 space-y-4 md:space-y-0 gap-2">
							<Controller
								name="name"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Hackathon Name</label>
										<Input
											{...field}
											placeholder="Enter hackathon name"
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
								name="date"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Date</label>
										<Input
											{...field}
											placeholder="e.g., 2024-03-15"
											error={fieldState.error?.message}
										/>
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
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<div>
							<label>Links</label>
							<CustomLink
								setValue={setValue}
								links={currentHackathon?.links || []}
							/>
						</div>

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{currentHackathon
									? "Update Hackathon"
									: "Add Hackathon"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
