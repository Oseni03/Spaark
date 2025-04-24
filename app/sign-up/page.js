import AuthPage from "@/components/auth-page";
import FormWrapper from "@/components/wrapper/form-wrapper";
import React from "react";

function Page() {
	return (
		<FormWrapper>
			<AuthPage
				actionText={"Sign up"}
				redirectPath={"/dashboard/portfolios"}
			/>
		</FormWrapper>
	);
}

export default Page;
