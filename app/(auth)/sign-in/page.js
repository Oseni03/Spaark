import React from "react";
import { LoginForm } from "@/components/forms/login-form";
import FormWrapper from "@/components/wrapper/form-wrapper";

function Page() {
	return (
		<FormWrapper>
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center">
						<h1 className="text-2xl font-semibold">Welcome back</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Sign In to access your portfolios
						</p>
					</div>

					<LoginForm />
				</div>
			</div>
		</FormWrapper>
	);
}

export default Page;
