import { SignUp } from "@clerk/nextjs";
import React from "react";

function Page() {
	return (
		<div className="flex justify-center items-center">
			<SignUp signInUrl="/sign-in" />
		</div>
	);
}

export default Page;
