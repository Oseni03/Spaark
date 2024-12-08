import { useState } from "react";
import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeInput } from "@/components/ui/badge-input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	addSkill,
	addSkillInDatabase,
	updateSkill,
	updateSkillnInDatabase,
} from "@/redux/features/skillSlice";
import { AnimatePresence, motion } from "framer-motion";

export const SkillDialog = ({ form, currentSkill, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentSkill) {
			dispatch(updateSkill({ id: currentSkill.id, ...data }));
			dispatch(updateSkillnInDatabase({ id: currentSkill.id, ...data }));
		} else {
			dispatch(addSkill(data));
			dispatch(addSkillInDatabase(data));
		}
		setIsOpen(false);
		reset();
	};

	const [pendingKeyword, setPendingKeyword] = useState("");

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentSkill ? "Edit Skill" : "Add New Skill"}
					</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[70vh]">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 pr-3"
					>
						<Controller
							name="name"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Skill Name</label>
									<Input
										{...field}
										placeholder="Enter skill name"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="keywords"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<div>
										<label>Keywords</label>
										<BadgeInput
											value={field.value} // Bind keywords value
											onChange={(newKeywords) =>
												field.onChange(newKeywords)
											} // Update keywords dynamically
											setPendingKeyword={
												setPendingKeyword
											} // Handler for pending keywords
										/>
									</div>
									<div className="grid md:grid-cols-2 md:space-x-2 space-y-4 md:space-y-0 w-full justify-center items-center">
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
											))}
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
								{currentSkill ? "Update Skill" : "Add Skill"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
