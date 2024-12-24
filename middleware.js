import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByUsername } from "./services/user";

const isProtectedRoute = createRouteMatcher(["/builder(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	// Check if the route is protected and enforce authentication if it is
	if (isProtectedRoute(req)) auth().protect();

	const url = req.nextUrl;
	const pathname = url.pathname;

	// Get hostname (e.g., 'mike.com', 'test.mike.com')
	const hostname = req.headers.get("host");

	let currentHost;
	if (process.env.NODE_ENV === "production") {
		// Production logic remains the same
		const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
		currentHost = hostname?.replace(`.${baseDomain}`, "");
	} else {
		// Updated development logic
		console.log("Splitted: ", hostname?.split(":")[0]);
		currentHost = hostname?.split(":")[0].replace(".localhost", "");
	}
	// If there's no currentHost, likely accessing the root domain, handle accordingly
	if (!currentHost || currentHost === "localhost") {
		// Continue to the next middleware or serve the root content
		return NextResponse.next();
	}

	// // Fetch tenant-specific data based on the hostname
	// const response = await getUserByUsername(currentHost);

	// // Handle the case where no domain data is found
	// if (!response.success || !response.data) {
	// 	// Continue to the next middleware or serve the root content
	// 	return NextResponse.next();
	// }

	// const username = response.data.username;

	console.log("Hostname:", hostname);
	console.log("Current Host:", currentHost);

	return NextResponse.rewrite(new URL(`/${currentHost}${pathname}`, req.url));
});

// Define which paths the middleware should run for
export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
