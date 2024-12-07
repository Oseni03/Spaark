import { SignIn } from "@clerk/nextjs";
import React from "react";

function Page() {
	return (
		<div className="flex justify-center self-center">
			<SignIn signUpUrl="/sign-up" />
		</div>
	);
}

export default Page;
