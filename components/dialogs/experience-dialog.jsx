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
} from "@/redux/features/portfolioSlice";
import { PictureSection } from "../sections/picture/section";
import { BadgeInput } from "../ui/badge-input";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { X } from "@phosphor-icons/react";

export const ExperienceDialog = ({
	portfolioId,
	form,
	currentExperience,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		if (currentExperience) {
			dispatch(
				updateExperience({
					id: currentExperience.id,
					...data,
					portfolioId,
				})
			);
		} else {
			dispatch(addExperience({ ...data, portfolioId }));
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
						<PictureSection control={control} setValue={setValue} />

						<div className="grid md:grid-cols-2 gap-2 space-y-4 md:space-y-0">
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
								name="position"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Position</label>
										<Input
											{...field}
											placeholder="Enter your position"
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
								name="date"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Date or Date Range</label>
										<Input
											{...field}
											placeholder="e.g., March 2023 - Present"
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
								name="location"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Location</label>
										<Input
											{...field}
											placeholder="Enter location"
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
							name="url"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Website</label>
									<Input
										{...field}
										placeholder="Enter company website"
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
							name="technologies"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<div>
										<label>Technologies</label>
										<BadgeInput
											value={field.value} // Bind keywords value
											onChange={(newKeywords) =>
												field.onChange(newKeywords)
											} // Update keywords dynamically
											placeholder="Enter keywords separated by commas"
											error={fieldState.error?.message}
										/>
									</div>
									<div className="flex flex-wrap items-center gap-x-2 gap-y-3">
										<AnimatePresence>
											{field.value &&
												field.value.map(
													(item, index) => (
														<motion.div
															key={item}
															layout
															initial={{
																opacity: 0,
																y: -50,
															}}
															animate={{
																opacity: 1,
																y: 0,
																transition: {
																	delay:
																		index *
																		0.1,
																},
															}}
															exit={{
																opacity: 0,
																x: -50,
															}}
														>
															<Badge
																className="cursor-pointer"
																onClick={() => {
																	field.onChange(
																		field.value.filter(
																			(
																				v
																			) =>
																				v !==
																				item
																		)
																	);
																}}
															>
																<span className="mr-1">
																	{item}
																</span>
																<X
																	size={12}
																	weight="bold"
																/>
															</Badge>
														</motion.div>
													)
												)}
										</AnimatePresence>
									</div>
								</>
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
