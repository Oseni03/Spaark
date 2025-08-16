"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "@/services/user";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export function LoginForm({ className, ...props }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signInWithGoogle = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
	};

	async function onSubmit(values) {
		setIsLoading(true);

		const { success, message } = await signIn(
			values.email,
			values.password
		);

		if (success) {
			toast.success(message);
			router.push("/dashboard");
		} else {
			toast.error(message);
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<div className="grid gap-4">
						<Button
							variant="outline"
							type="button"
							className="w-full"
							onClick={signInWithGoogle}
						>
							<svg
								className="mr-2 h-4 w-4"
								aria-hidden="true"
								viewBox="0 0 24 24"
							>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Continue with Google
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						{/* Email Input */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="you@example.com"
											{...field}
											className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password Input */}
						<div className="grid gap-3">
							<div className="flex flex-col gap-2">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													{...field}
													type="password"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Link
									href="/forgot-password"
									className="ml-auto text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</Link>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Sign in"
						)}
					</Button>
				</form>
			</Form>

			<div className="text-center text-sm text-gray-500 dark:text-gray-400">
				Don&apos;t have an account?{" "}
				<Link
					href="/sign-up"
					className="font-semibold text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
				>
					Sign up
				</Link>
			</div>

			<div className="text-center text-xs text-gray-500 dark:text-gray-400">
				By clicking continue, you agree to our{" "}
				<Link
					href="#"
					className="underline hover:text-gray-900 dark:hover:text-white"
				>
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link
					href="#"
					className="underline hover:text-gray-900 dark:hover:text-white"
				>
					Privacy Policy
				</Link>
			</div>
		</div>
	);
}
