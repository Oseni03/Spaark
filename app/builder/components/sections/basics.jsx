import { Basics, basicsSchema, defaultBasics } from "@/schema/basics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PictureSection } from "./picture/section";

export const BasicsSection = () => {
	const form = useForm({
		resolver: zodResolver(basicsSchema),
		defaultValues: defaultBasics,
	});

	// Handle form submission
	function onSubmit(values) {
		// TODO: Handle form submission
		console.log(values);
	}

	return (
		<section id="basics" className="grid gap-y-6">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-x-4">
					<h2 className="line-clamp-1 text-3xl font-bold">Basics</h2>
				</div>
			</header>

			<main className="flex flex-col w-full">
				<div className="sm:col-span-2">
					<PictureSection />
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-3"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Your full name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="headline"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Headline</FormLabel>
									<FormControl>
										<Input
											placeholder="Professional headline"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid md:grid-cols-2 md:space-x-2 space-y-3">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="your.email@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input
												type="tel"
												placeholder="+1 (555) 123-4567"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid md:grid-cols-2 md:space-x-2 space-y-3 items-center">
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location</FormLabel>
										<FormControl>
											<Input
												placeholder="City, Country"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Website</FormLabel>
										<FormControl>
											<Input
												type="url"
												placeholder="https://yourwebsite.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type="submit" className="w-full">
							Save
						</Button>
					</form>
				</Form>
			</main>
		</section>
	);
};
