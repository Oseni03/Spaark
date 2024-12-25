import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/builder(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	// Check if the route is protected and enforce authentication if it is
	if (isProtectedRoute(req)) auth.protect();

	const url = req.nextUrl;
	const pathname = url.pathname;
	const searchParams = url.search;

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
	if (
		!currentHost ||
		currentHost === "localhost" ||
		currentHost === "www" ||
		currentHost === process.env.NEXT_PUBLIC_ROOT_DOMAIN
	) {
		// Continue to the next middleware or serve the root content
		return NextResponse.next();
	}

	// If it's an API request from a subdomain
	if (url.pathname.startsWith("/api/")) {
		// Rewrite to the main domain's API
		const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
		let newURL;

		if (process.env.NODE_ENV === "production") {
			newURL = `https://${mainDomain}${url.pathname}${searchParams}`;
		} else {
			newURL = `http://${mainDomain}${url.pathname}${searchParams}`;
		}
		return NextResponse.rewrite(new URL(newURL, req.url));
	}

	return NextResponse.rewrite(new URL(`/${currentHost}${pathname}`, req.url));
});

// Define which paths the middleware should run for
export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
