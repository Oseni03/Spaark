import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { addSocial, updateSocial } from "@/redux/features/portfolioSlice";
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

export const SocialsDialog = ({
	portfolioId,
	form,
	currentSocial,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentSocial) {
			dispatch(
				updateSocial({
					id: currentSocial.id,
					...data,
					portfolioId,
				})
			);
		} else {
			dispatch(addSocial({ ...data, portfolioId }));
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
							{currentSocial ? "Edit Social" : "Add New Social"}
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

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{currentSocial ? "Update Social" : "Add Social"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
