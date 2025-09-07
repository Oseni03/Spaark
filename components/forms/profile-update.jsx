"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
});

export function ProfileUpdate({ className, setError, ...props }) {
	const { data, isPending } = useSession();
	const [isUpdating, setIsUpdating] = useState(false);
	const user = !isPending ? data?.user : null;

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
		},
	});

	const onSubmit = async (data) => {
		try {
			setIsUpdating(true);
			setError(null);
			if (data.email !== user.email) {
				await authClient.changeEmail({
					newEmail: data.newPassword,
					callbackURL: "/dashboard/settings", //to redirect after verification
				});
			}
			await authClient.updateUser({
				name: data.name,
			});
			toast.success("Profile updated successfully");
		} catch (err) {
			const errorMessage =
				err?.data?.error?.message || "Failed to update profile";
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
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="name">Full Name</Label>
					<Input
						id="name"
						{...register("name")}
						className={errors.name ? "border-destructive" : ""}
						placeholder="Enter your full name"
					/>
					{errors.name && (
						<p className="text-sm text-destructive">
							{errors.name.message}
						</p>
					)}
				</div>

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
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={!isDirty || isUpdating}>
					{isUpdating && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					Save Changes
				</Button>
			</div>
		</form>
	);
}
