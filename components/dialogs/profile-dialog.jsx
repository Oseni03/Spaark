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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { socialNetworks } from "@/utils/constants";

export const ProfilesDialog = ({ form, currentProfile, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentProfile) {
			dispatch(updateProfile({ id: currentProfile.id, ...data }));
			dispatch(
				updateProfileInDatabase({ id: currentProfile.id, ...data })
			);
		} else {
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
						<div className="grid md:grid-cols-2 space-y-4 md:space-y-0 gap-2">
							<Controller
								name="network"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Network</label>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select social network" />
											</SelectTrigger>
											<SelectContent>
												{socialNetworks.map(
													(network, idx) => (
														<SelectItem
															key={idx}
															value={
																network.value
															}
														>
															{network.label}
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
								name="username"
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<label>Username</label>
										<Input
											{...field}
											placeholder="john.doe"
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
										placeholder="https://linkedin.com/in/johndoe"
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
