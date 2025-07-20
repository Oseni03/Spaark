import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const isProtectedRoute = (pathname) => {
	return pathname.startsWith("/builder") || pathname.startsWith("/dashboard");
};

const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request) {
	const { nextUrl: url } = request;
	const { pathname, search } = request.nextUrl;

	// Get session from cookie
	const sessionCookie = getSessionCookie(request);

	// Check if the path is an auth path
	const isAuthPath = authPaths.some((path) => pathname === path);

	// If the path is protected and no session exists, redirect to login
	if (isProtectedRoute(pathname) && !sessionCookie) {
		const url = new URL("/sign-in", request.url);
		url.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(url);
	}

	// If there's a session and trying to access an auth page, redirect to dashboard
	if (isAuthPath && sessionCookie) {
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

	// Handle subdomains and custom domains
	const hostname = request.headers.get("host");
	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
	const isProduction = process.env.NODE_ENV === "production";

	let domain = isProduction
		? hostname.replace(`.${rootDomain}`, "")
		: hostname
				.split(":")[0]
				.replace(".localhost", "")
				.replace("adequate-adequately-husky.ngrok-free.app", "");

	// If it's a root domain, www, or localhost, continue as normal
	if (!domain || ["localhost", "www", rootDomain].includes(domain)) {
		return NextResponse.next();
	}

	// If it's an API request from subdomains, rewrite to main domain
	if (url.pathname.startsWith("/api/")) {
		const mainDomain = rootDomain;
		const protocol = isProduction ? "https" : "http";
		const newURL = `${protocol}://${mainDomain}${pathname}${search}`;
		return NextResponse.rewrite(new URL(newURL));
	}

	// Detect if this is a custom domain (not a subdomain of root domain)
	const isCustomDomain = isProduction
		? !hostname.endsWith(`.${rootDomain}`)
		: !hostname.endsWith(".localhost") && hostname !== "localhost";

	if (isCustomDomain) {
		// Rewrite to a special catch-all route, passing the custom domain as a query param
		const subdomain = isProduction
			? hostname.replace(`.${rootDomain}`, "")
			: hostname.replace(".localhost:3000", "");
		const rewrittenUrl = new URL(`/${subdomain}${pathname}`, request.url);
		rewrittenUrl.searchParams.set("domain", subdomain);
		return NextResponse.rewrite(rewrittenUrl);
	}

	// Otherwise, treat as subdomain
	return NextResponse.rewrite(new URL(`/${domain}${pathname}`, request.url));
}

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
