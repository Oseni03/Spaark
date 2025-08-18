import React from "react";
import FormWrapper from "@/components/forms/form-wrapper";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

function Page() {
	return (
		<FormWrapper>
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-full max-w-md">
					<ForgotPasswordForm />
				</div>
			</div>
		</FormWrapper>
	);
}

export default Page;
