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
import { addHackathon, updateHackathon } from "@/redux/features/portfolioSlice";
import { PictureSection } from "../sections/picture/section";
import { CustomLink } from "@/components/custom-link";
import { logger } from "@/lib/utils";

export const HackathonDialog = ({
	form,
	currentHackathon,
	portfolioId,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		logger.info("Hackathon data submitted:", data);
		if (currentHackathon) {
			dispatch(
				updateHackathon({
					...data,
					id: currentHackathon.id,
					portfolioId,
				})
			);
		} else {
			dispatch(addHackathon({ ...data, portfolioId }));
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
										/>
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
