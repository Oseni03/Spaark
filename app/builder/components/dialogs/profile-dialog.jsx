import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Assuming you have these defined in your schema/types
import { profileSchema, defaultProfile } from "@/schema/sections/profile";
import {
	addProfile,
	updateProfile,
	removeProfile,
} from "@/redux/features/profileSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const ProfilesDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentProfile, setCurrentProfile] = useState(null);
	const dispatch = useDispatch();

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, defaultValues },
	} = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: defaultProfile,
	});

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form Validation Errors:", errors);
			console.log("Form Default values:", defaultValues);
		}
	}, [errors, defaultValues]);

	const handleIconChange = useCallback(
		(event) => {
			const iconSlug = event.target.value;
			setValue("icon", iconSlug);
		},
		[setValue]
	);

	const onSubmit = (data) => {
		if (currentProfile) {
			dispatch(updateProfile({ id: currentProfile.id, ...data }));
		} else {
			console.log(data);
			dispatch(addProfile(data));
		}
		setIsOpen(false);
		reset();
	};

	const openCreateDialog = () => {
		reset(defaultProfile);
		setCurrentProfile(null);
		setIsOpen(true);
	};

	const openEditDialog = (profile) => {
		reset(profile);
		setCurrentProfile(profile);
		setIsOpen(true);
	};

	return (
		<>
			<Button
				onClick={openCreateDialog}
				variant="outline"
				className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
			>
				<Plus size={14} />
				<span className="font-medium">Add a new item</span>
			</Button>

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
