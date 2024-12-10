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

export const ProjectDialog = ({ form, currentProject, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const links = useSelector((state) => state.project.links);
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
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

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
									<label>Project URL</label>
									<Input
										{...field}
										placeholder="Enter project URL (if applicable)"
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
										placeholder="e.g., March 2023"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>
						<Controller
							name="source"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Source Code URL</label>
									<Input
										{...field}
										placeholder="Enter source code URL (if applicable)"
										error={fieldState.error?.message}
									/>
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
										{field.value.map((item, index) => (
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
														delay: index * 0.1,
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
																(v) =>
																	v !== item
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
										))}
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
									onChange={(value) => field.onChange(value)}
									error={fieldState.error?.message}
								/>
							</div>
						)}
					/>

					<Controller
						name="links"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Links</label>
								<CustomLink
									links={links}
									setValue={(value) => field.onChange(value)}
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
							{currentProject ? "Update Project" : "Add Project"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
