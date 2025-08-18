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
import { addProject, updateProject } from "@/redux/features/portfolioSlice";
import Uploader from "../picture/uploader";
import { logger } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { projectTypes } from "@/utils/constants";

export const ProjectDialog = ({
	portfolioId,
	form,
	currentProject,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		logger.info("Project data:", data);
		if (currentProject) {
			dispatch(
				updateProject({
					id: currentProject.id,
					...data,
					portfolioId,
				})
			);
		} else {
			dispatch(addProject({ ...data, portfolioId }));
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
							defaultName={
								currentProject?.image
									? "image"
									: currentProject?.video
										? "video"
										: null
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
								name="type"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Project Type</label>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select project type" />
											</SelectTrigger>
											<SelectContent>
												{projectTypes.map(
													(type, idx) => (
														<SelectItem
															key={idx}
															value={type.value}
														>
															{type.label}
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

							<Controller
								name="website"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Live Website</label>
										<Input
											{...field}
											placeholder="https://project-demo.com"
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
								name="source"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Source URL</label>
										<Input
											{...field}
											placeholder="https://github.com/user/project"
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
