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
import {
	addPortfolioInDatabase,
	updatePortfolioInDatabase,
} from "@/redux/thunks/portfolio";
import { createId } from "@paralleldrive/cuid2";
import { Checkbox } from "../ui/checkbox";
import { defaultPortfolio } from "@/schema/sections";

export const PortfolioDialog = ({
	form,
	currentPortfolio,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const { reset, handleSubmit, control } = form;

	const onSubmit = (data) => {
		if (currentPortfolio) {
			dispatch(
				updatePortfolioInDatabase({
					id: currentPortfolio.id,
					data: { ...currentPortfolio, ...data },
				})
			);
		} else {
			dispatch(addPortfolioInDatabase({ ...defaultPortfolio, data }));
		}
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{currentPortfolio
							? "Edit Portfolio"
							: "Add New Portfolio"}
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 pr-3"
				>
					<Controller
						name="name"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Portfolio Name</label>
								<Input
									{...field}
									placeholder="Enter portfolio name"
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
						name="slug"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Slug</label>
								<Input {...field} placeholder="Enter slug" />
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
							</div>
						)}
					/>

					<Controller
						name="isPublic"
						control={control}
						render={({ field, fieldState }) => (
							<div className="items-top flex space-x-2">
								<Checkbox
									id="isPublic"
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="isPublic"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Public
									</label>
									<p className="text-sm text-muted-foreground">
										Make this portfolio public.
									</p>
								</div>
							</div>
						)}
					/>

					<Controller
						name="isPrimary"
						control={control}
						render={({ field, fieldState }) => (
							<div className="items-top flex space-x-2">
								<Checkbox
									id="isPrimary"
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="isPrimary"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Primary
									</label>
									<p className="text-sm text-muted-foreground">
										Make this portfolio your primary
										portfolio.
									</p>
								</div>
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
							{currentPortfolio
								? "Update Portfolio"
								: "Add Portfolio"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
