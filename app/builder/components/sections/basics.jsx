import { basicsSchema, defaultBasics } from "@/schema/basics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PictureSection } from "./picture/section";
import { useDispatch } from "react-redux";
import { updateBasics } from "@/redux/features/basicSlice"; // Ensure this import is correct
import { useEffect } from "react";

export const BasicsSection = () => {
	const dispatch = useDispatch();
	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors, defaultValues },
	} = useForm({
		resolver: zodResolver(basicsSchema),
		defaultValues: defaultBasics,
	});

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("Form Validation Errors:", errors);
			console.log("Form default values:", defaultValues);
		}
	}, [errors, defaultValues]);

	const onSubmit = (data) => {
		dispatch(updateBasics(data));
		console.log("Form Submitted:", data);
	};

	return (
		<section id="basics" className="grid gap-y-6">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">Basics</h2>
				</div>
			</header>

			<main className="flex flex-col w-full">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div className="sm:col-span-2">
						<PictureSection control={control} setValue={setValue} />
					</div>
					<div className="grid md:grid-cols-2 gap-2 space-y-3 md:space-y-0">
						<Controller
							name="name"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label htmlFor="name">Full Name</label>
									<Input
										id="name"
										{...field}
										placeholder="Your full name"
									/>
									{fieldState.error && (
										<p className="text-red-500 text-sm">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							name="headline"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label htmlFor="headline">Headline</label>
									<Input
										id="headline"
										{...field}
										placeholder="Professional headline"
									/>
									{fieldState.error && (
										<p className="text-red-500 text-sm">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							name="email"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label htmlFor="email">Email</label>
									<Input
										id="email"
										{...field}
										placeholder="your.email@example.com"
									/>
									{fieldState.error && (
										<p className="text-red-500 text-sm">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							name="phone"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label htmlFor="phone">Phone</label>
									<Input
										id="phone"
										{...field}
										type="tel"
										placeholder="+1 (555) 123-4567"
									/>
									{fieldState.error && (
										<p className="text-red-500 text-sm">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							name="location"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label htmlFor="location">Location</label>
									<Input
										id="location"
										{...field}
										placeholder="City, Country"
									/>
									{fieldState.error && (
										<p className="text-red-500 text-sm">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							name="url"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label htmlFor="url">Website</label>
									<Input
										id="url"
										{...field}
										placeholder="https://yourwebsite.com"
										type="url"
									/>
									{fieldState.error && (
										<p className="text-red-500 text-sm">
											{fieldState.error.message}
										</p>
									)}
								</div>
							)}
						/>
					</div>

					<Button type="submit" className="w-full">
						Save
					</Button>
				</form>
			</main>
		</section>
	);
};
