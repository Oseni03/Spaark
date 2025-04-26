import { NextResponse } from "next/server";

const isProtectedRoute = (pathname) => {
	return pathname.startsWith("/builder") || pathname.startsWith("/dashboard");
};

const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request) {
	const { nextUrl: url } = request;
	const { pathname, search } = request.nextUrl;

	// Get Firebase auth token from cookie
	const hasAuthToken = request.cookies.has("firebaseAuthToken");

	// Check if the path is an auth path
	const isAuthPath = authPaths.some((path) => pathname === path);

	// If the path is protected and no token exists, redirect to login
	if (isProtectedRoute(pathname) && !hasAuthToken) {
		const url = new URL("/sign-in", request.url);
		url.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(url);
	}

	// If there's a token and trying to access an auth page, redirect to dashboard
	if (isAuthPath && hasAuthToken) {
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

	// Handle subdomains
	const hostname = request.headers.get("host");
	const domain =
		process.env.NODE_ENV === "production"
			? hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
			: hostname
					.split(":")[0]
					.replace(".localhost", "")
					.replace("adequate-adequately-husky.ngrok-free.app", "");

	if (
		!domain ||
		["localhost", "www", process.env.NEXT_PUBLIC_ROOT_DOMAIN].includes(
			domain
		)
	) {
		return NextResponse.next();
	}

	// Handle API requests from subdomains
	if (url.pathname.startsWith("/api/")) {
		const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
		const protocol =
			process.env.NODE_ENV === "production" ? "https" : "http";
		const newURL = `${protocol}://${mainDomain}${pathname}${search}`;
		return NextResponse.rewrite(new URL(newURL));
	}

	// Pass the domain to the dynamic route
	return NextResponse.rewrite(new URL(`/${domain}${pathname}`, request.url));
}

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
