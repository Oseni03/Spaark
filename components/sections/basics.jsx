"use client";

import { basicsSchema, defaultBasics } from "@/schema/sections/basics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PictureSection } from "./picture/section";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { updateBasics } from "@/redux/features/portfolioSlice";
import { useEffect, useState } from "react";
import { RichInput } from "@/components/ui/rich-input";
import { logger } from "@/lib/utils";
import { Spinner } from "../ui/Spinner";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";

export const BasicsSection = () => {
	const { portfolioId } = useParams();
	const portfolio = useSelector((state) =>
		state.portfolios.items.find((item) => item.id === portfolioId)
	);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors, defaultValues },
	} = useForm({
		resolver: zodResolver(basicsSchema),
		defaultValues: portfolio?.basics || {
			...defaultBasics,
			id: createId(),
		},
	});

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			logger.error("Form Validation Errors:", errors);
			logger.info("Form default values:", defaultValues);
		}
	}, [errors, defaultValues]);

	const onSubmit = async (data) => {
		setLoading(true);
		try {
			await dispatch(updateBasics({ portfolioId, ...data })).unwrap();
			logger.info("User basics updated");
			toast.success("Basics information updated");
		} catch (error) {
			logger.error("Error updating basics:", error);
		} finally {
			setLoading(false);
		}
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
							name="years"
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<label>Years of Experience</label>
									<Input
										{...field}
										placeholder="Years of experience"
										type="number"
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
					<Controller
						name="summary"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>Summary</label>
								<RichInput
									{...field}
									content={field.value}
									onChange={(value) => field.onChange(value)}
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
						name="about"
						control={control}
						render={({ field, fieldState }) => (
							<div>
								<label>About</label>
								<RichInput
									{...field}
									content={field.value}
									onChange={(value) => field.onChange(value)}
								/>
								{fieldState.error && (
									<small className="text-red-500 opacity-75">
										{fieldState.error?.message}
									</small>
								)}
							</div>
						)}
					/>

					<Button
						type="submit"
						className="w-full relative"
						disabled={loading}
					>
						{loading ? (
							<>
								<Spinner className="mr-2" />
								Saving...
							</>
						) : (
							"Save"
						)}
					</Button>
				</form>
			</main>
		</section>
	);
};
