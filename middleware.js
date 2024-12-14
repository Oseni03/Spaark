import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/builder(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	const url = req.nextUrl;
	const path = url.pathname;

	// Exclude Next.js internal assets and specific routes from middleware
	const excludedPaths = ["/_next", "/api", "/trpc", "/sign-in", "/sign-up"];

	if (excludedPaths.some((excludedPath) => path.startsWith(excludedPath))) {
		return NextResponse.next();
	}

	if (isProtectedRoute(req)) {
		await auth.protect();
	}

	// Get the hostname from the request
	// const hostname = req.headers.get("host") || "";
	let hostname = req.headers
		.get("host")
		.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
	console.log("Hostname: ", hostname);

	// Only proceed if hostname is not "localhost:3000" (root domain)
	if (hostname && hostname !== `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
		// Extract the subdomain (e.g., 'new-site' from 'new-site.localhost:3000')
		const subdomain = hostname.split(".")[0];
		console.log("Subdomain: ", subdomain);

		// Construct the new path by prepending the subdomain
		let newPath = `/${subdomain}`;
		console.log("New path: ", newPath);

		return NextResponse.rewrite(new URL(newPath, req.url));
	}

	// If hostname is "localhost:3000", don't rewrite, continue normal flow
	return NextResponse.next();
});

export const config = {
	matcher: [
		// Run middleware on all routes except specified exclusions
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
	],
};
