"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useCodeActivation } from "@/hooks/use-code-activation";

function Page() {
	const { formData, errors, isSubmitting, handleChange, handleSubmit } =
		useCodeActivation();
	return (
		<PageWrapper>
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Activate discount code</CardTitle>
						<CardDescription>
							Activate code gotten from AppSumo
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="grid space-y-3"
						>
							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className={
										errors.email ? "border-red-500" : ""
									}
								/>
								{errors.email && (
									<small className="text-red-500">
										{errors.email}
									</small>
								)}
							</div>

							<div className="space-y-2">
								<Label>Code</Label>
								<Input
									type="text"
									name="code"
									value={formData.code}
									onChange={handleChange}
									className={
										errors.code ? "border-red-500" : ""
									}
								/>
								{errors.code && (
									<small className="text-red-500">
										{errors.code}
									</small>
								)}
							</div>

							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full"
							>
								{isSubmitting && <Spinner />}
								{isSubmitting ? "Activating..." : "Activate"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</PageWrapper>
	);
}

export default Page;
