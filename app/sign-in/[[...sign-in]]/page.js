import FormWrapper from "@/components/wrapper/form-wrapper";
import { SignIn } from "@clerk/nextjs";
import React from "react";

function Page() {
	return (
		<FormWrapper>
			<SignIn signUpUrl="/sign-up" />
		</FormWrapper>
	);
}

export default Page;
