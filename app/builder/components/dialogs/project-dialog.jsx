import { useDispatch, useSelector } from "react-redux";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeInput } from "@/components/ui/badge-input"; // Assumes BadgeInput exists for handling keywords
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichInput } from "@/components/ui/rich-input";
import {
	addProject,
	addProjectInDatabase,
	updateProject,
	updateProjectnInDatabase,
} from "@/redux/features/projectSlice";
import { CustomLink } from "@/components/custom-link";
import Uploader from "../sections/picture/uploader";

export const ProjectDialog = ({ form, currentProject, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		console.log("Project data: ", data);
		if (currentProject) {
			dispatch(updateProject({ id: currentProject.id, ...data }));
			dispatch(
				updateProjectnInDatabase({ id: currentProject.id, ...data })
			);
		} else {
			dispatch(addProject(data));
			dispatch(addProjectInDatabase(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen} className="w-full">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentProject ? "Edit Project" : "Add New Project"}
					</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[70vh]">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Uploader
							defaultValue={
								currentProject?.image || currentProject?.video
							}
							setValue={setValue}
						/>
						<div className="grid md:grid-cols-2 gap-2 space-y-4 md:space-y-0">
							<Controller
								name="name"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Project Name</label>
										<Input
											{...field}
											placeholder="Enter project name"
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
								name="url"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Project URL</label>
										<Input
											{...field}
											placeholder="Enter project URL (if applicable)"
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
										<label>Date</label>
										<Input
											{...field}
											placeholder="e.g., March 2023"
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
												error={
													fieldState.error?.message
												}
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
																	transition:
																		{
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
																		size={
																			12
																		}
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
								links={currentProject?.links || []}
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
								{currentProject
									? "Update Project"
									: "Add Project"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
