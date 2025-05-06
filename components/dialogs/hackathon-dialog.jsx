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
import { BadgeInput } from "../ui/badge-input";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { X } from "@phosphor-icons/react";

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
