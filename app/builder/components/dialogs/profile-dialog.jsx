import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import {
	addProfile,
	addProfileInDatabase,
	updateProfile,
	updateProfileInDatabase,
} from "@/redux/features/profileSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export const ProfilesDialog = ({ form, currentProfile, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const { setValue, reset, handleSubmit, control } = form;

	const handleIconChange = useCallback(
		(event) => {
			const iconSlug = event.target.value;
			setValue("icon", iconSlug);
		},
		[setValue]
	);

	const onSubmit = (data) => {
		if (currentProfile) {
			console.log("Updated profile: ", data);
			dispatch(updateProfile({ id: currentProfile.id, ...data }));
			dispatch(
				updateProfileInDatabase({ id: currentProfile.id, ...data })
			);
		} else {
			console.log(data);
			dispatch(addProfile(data));
			dispatch(addProfileInDatabase(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{currentProfile
								? "Edit Profile"
								: "Add New Profile"}
						</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<Controller
							name="network"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Network</label>
									<Input
										{...field}
										placeholder="LinkedIn"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="username"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Username</label>
									<Input
										{...field}
										placeholder="john.doe"
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
									<label>Website</label>
									<Input
										{...field}
										placeholder="https://linkedin.com/in/johndoe"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="icon"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Icon</label>
									<div className="flex items-center space-x-2">
										<Input
											{...field}
											placeholder="linkedin"
											onChange={(e) => {
												field.onChange(e);
												handleIconChange(e);
											}}
											error={fieldState.error?.message}
										/>
										{field.value && (
											<img
												src={`https://cdn.simpleicons.org/${field.value}`}
												alt="Icon"
												className="w-8 h-8"
											/>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										Powered by{" "}
										<a
											href="https://simpleicons.org/"
											target="_blank"
											rel="noopener noreferrer nofollow"
											className="font-medium"
										>
											Simple Icons
										</a>
									</p>
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
								{currentProfile
									? "Update Profile"
									: "Add Profile"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
