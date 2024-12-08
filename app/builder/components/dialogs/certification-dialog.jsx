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
import {
	addCertification,
	addCertificationInDatabase,
	updateCertification,
	updateCertificationnInDatabase,
} from "@/redux/features/certificationSlice";

export const CertificationDialog = ({
	form,
	currentCertification,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentCertification) {
			dispatch(
				updateCertification({ id: currentCertification.id, ...data })
			);
			dispatch(
				updateCertificationnInDatabase({
					id: currentCertification.id,
					...data,
				})
			);
		} else {
			dispatch(addCertification(data));
			dispatch(addCertificationInDatabase(data));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentCertification
							? "Edit Certification"
							: "Add New Certification"}
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
									<label>Certification Name</label>
									<Input
										{...field}
										placeholder="Enter certification name"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="issuer"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Issuer</label>
									<Input
										{...field}
										placeholder="Enter issuer name"
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
							name="url"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>URL</label>
									<Input
										{...field}
										placeholder="Enter URL (if applicable)"
										error={fieldState.error?.message}
									/>
								</div>
							)}
						/>

						<Controller
							name="summary"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Summary</label>
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

						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{currentCertification
									? "Update Certification"
									: "Add Certification"}
							</Button>
						</div>
					</form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
