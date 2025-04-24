import { NextResponse } from "next/server";

const isProtectedRoute = (pathname) => {
	return pathname.startsWith("/builder") || pathname.startsWith("/dashboard");
};

// Define paths that should be redirected if user is already authenticated
const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request) {
	const { nextUrl: url, headers } = request;
	const { pathname, search } = request.nextUrl;

	// Get the auth cookie. In a real app, you'd verify this token with Firebase Admin SDK
	// For production, you should use Firebase Admin SDK server-side verification
	// This is a simplistic example
	const authCookie = request.cookies.get("authToken")?.value;
	const isAuthenticated = !!authCookie;

	// Check if the path is an auth path
	const isAuthPath = authPaths.some((path) => pathname === path);

	// If the path is protected and the user is not authenticated, redirect to login
	if (isProtectedRoute(pathname) && !isAuthenticated) {
		const url = new URL("/sign-in", request.url);
		url.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(url);
	}

	// If the user is authenticated and trying to access an auth page, redirect to dashboard
	if (isAuthPath && isAuthenticated) {
		return NextResponse.redirect(
			new URL("/dashboard/portfolios", request.url)
		);
	}

	// Redirect specific paths to "/dashboard/portfolios"
	if (["/dashboard", "/builder"].includes(pathname)) {
		return NextResponse.redirect(
			new URL("/dashboard/portfolios", request.url)
		);
	}

	// Determine the domain based on the environment
	const hostname = request.headers.get("host");
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
}

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
