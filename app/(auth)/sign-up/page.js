import { SignupForm } from "@/components/forms/signup-form";
import FormWrapper from "@/components/forms/form-wrapper";
import React from "react";

function Page() {
	return (
		<FormWrapper>
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center">
						<h1 className="text-2xl font-semibold">Welcome</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Sign up to create your portfolios
						</p>
					</div>

					<SignupForm />
				</div>
			</div>
		</FormWrapper>
	);
}

export default Page;
