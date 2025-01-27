import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/builder(.*)", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const { nextUrl: url, headers } = req;
	const { pathname, search } = url;

	// Enforce authentication for protected routes
	if (isProtectedRoute(req)) auth.protect();

	// Redirect specific paths to "/dashboard/portfolios"
	if (["/dashboard", "/builder"].includes(pathname)) {
		return NextResponse.redirect(new URL("/dashboard/portfolios", req.url));
	}

	// Determine the domain based on the environment
	const hostname = headers.get("host");
	const domain =
		process.env.NODE_ENV === "production"
			? hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
			: hostname
					.split(":")[0]
					.replace(".localhost", "")
					.replace("adequate-adequately-husky.ngrok-free.app", "");

	// Handle subdomains and API requests
	if (
		!domain ||
		["localhost", "www", process.env.NEXT_PUBLIC_ROOT_DOMAIN].includes(
			domain
		)
	) {
		return NextResponse.next();
	}

	// If it's an API request from a subdomain
	if (url.pathname.startsWith("/api/")) {
		// Rewrite to the main domain's API
		const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
		let newURL;

		if (process.env.NODE_ENV === "production") {
			newURL = `https://${mainDomain}${pathname}${search}`;
		} else {
			newURL = `http://${mainDomain}${pathname}${search}`;
		}
		return NextResponse.rewrite(new URL(newURL, req.url));
	}

	// Pass the domain to the dynamic route
	return NextResponse.rewrite(new URL(`/${domain}${pathname}`, req.url));
});

// Define paths for middleware execution
export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
