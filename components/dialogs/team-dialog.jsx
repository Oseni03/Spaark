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
import { PictureSection } from "../sections/picture/section";
import {
	addTeamMemberInDatabase,
	updateTeamMemberInDatabase,
} from "@/redux/thunks/team";
import { CustomLink } from "@/components/custom-link";

export const TeamDialog = ({
	portfolioId,
	form,
	currentTeamMember,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control, setValue } = form;

	const onSubmit = (data) => {
		if (currentTeamMember) {
			dispatch(
				updateTeamMemberInDatabase({
					id: currentTeamMember.id,
					...data,
					portfolioId,
				})
			);
		} else {
			dispatch(addTeamMemberInDatabase({ ...data, portfolioId }));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentTeamMember
							? "Edit Team Member"
							: "Add New Team Member"}
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
											placeholder="Enter member's name"
											error={fieldState.error?.message}
										/>
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
											placeholder="e.g., Frontend Developer"
											error={fieldState.error?.message}
										/>
									</div>
								)}
							/>
						</div>

						<Controller
							name="bio"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Bio</label>
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
								links={currentTeamMember?.links || []}
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
								{currentTeamMember
									? "Update Member"
									: "Add Member"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
