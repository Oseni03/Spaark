import FormWrapper from "@/components/wrapper/form-wrapper";
import { SignUp } from "@clerk/nextjs";
import React from "react";

function Page() {
	return (
		<FormWrapper>
			<SignUp signInUrl="/sign-in" />
		</FormWrapper>
	);
}

export default Page;
