import React from "react";
import FormWrapper from "@/components/forms/form-wrapper";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

function Page() {
	return (
		<FormWrapper>
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-full max-w-md">
					<ResetPasswordForm />
				</div>
			</div>
		</FormWrapper>
	);
}

export default Page;
