// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
	});
}
export function CSPostHogProvider({ children }) {
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function ThemeProvider({ children, ...props }) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
