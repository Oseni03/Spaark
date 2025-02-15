import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	addTestimonialInDatabase,
	updateTestimonialInDatabase,
} from "@/redux/thunks/testimonials";
import { PictureSection } from "../sections/picture/section";

export const TestimonialDialog = ({
	portfolioId,
	form,
	currentTestimonial,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		if (currentTestimonial) {
			dispatch(
				updateTestimonialInDatabase({
					id: currentTestimonial.id,
					...data,
					portfolioId,
				})
			);
		} else {
			dispatch(addTestimonialInDatabase({ ...data, portfolioId }));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentTestimonial
							? "Edit Testimonial"
							: "Add New Testimonial"}
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
							name="avatar"
						/>

						<div className="grid md:grid-cols-2 gap-2 space-y-4 md:space-y-0">
							<Controller
								name="name"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Name</label>
										<Input
											{...field}
											placeholder="Enter person's name"
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
								name="role"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Role</label>
										<Input
											{...field}
											placeholder="e.g., CEO, Software Engineer"
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
								name="company"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Company</label>
										<Input
											{...field}
											placeholder="Enter company name"
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
								name="rating"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Rating (1-5)</label>
										<Input
											{...field}
											type="number"
											min="1"
											max="5"
											value={field.value || 5} // Ensure there's always a value
											onChange={(e) =>
												field.onChange(
													Number(e.target.value)
												)
											} // Convert to number
											placeholder="Rating (1-5)"
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
							name="message"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Testimonial Message</label>
									<Textarea
										{...field}
										placeholder="Write your testimonial message..."
										className="min-h-[100px] resize-none"
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
								{currentTestimonial
									? "Update Testimonial"
									: "Add Testimonial"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
