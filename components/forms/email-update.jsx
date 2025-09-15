"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const emailSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

export function EmailUpdate({ className, setError, ...props }) {
	const { data, isPending } = useSession();
	const [isUpdating, setIsUpdating] = useState(false);
	const user = !isPending ? data?.user : null;

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: user?.email || "",
		},
	});

	const onSubmit = async (data) => {
		try {
			setIsUpdating(true);
			setError(null);
			if (data.email !== user.email) {
				const { data: respData, error } = await authClient.changeEmail({
					newEmail: data.email,
					callbackURL: "/dashboard/settings", //to redirect after verification
				});
				if (error || respData?.status !== 200) {
					throw error;
				}
				toast.success(
					"Email change request sent. Please check your inbox."
				);
			}
		} catch (err) {
			const errorMessage = err?.message || "Failed to change email";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn("space-y-4", className)}
			{...props}
		>
			<div className="space-y-2">
				<Label htmlFor="email">Email Address</Label>
				<Input
					id="email"
					type="email"
					{...register("email")}
					className={errors.email ? "border-destructive" : ""}
					placeholder="Enter your email address"
				/>
				{errors.email && (
					<p className="text-sm text-destructive">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={!isDirty || isUpdating}>
					{isUpdating && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					Change Email
				</Button>
			</div>
		</form>
	);
}
