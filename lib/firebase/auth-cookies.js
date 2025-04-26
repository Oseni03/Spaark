// lib/firebase/auth-cookies.js
import { auth } from "./config";
import { onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";
import { COOKIE_NAME } from "@/utils/constants";

// Cookie configuration
const COOKIE_OPTIONS = {
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	expires: 7, // 7 days
};

// Set up auth state change listener to manage cookies
export function initAuthCookies() {
	if (typeof window === "undefined") return; // Server-side guard

	return onAuthStateChanged(auth, async (user) => {
		if (user) {
			// User is signed in
			try {
				const token = await user.getIdToken();
				// Set the auth cookie
				Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
			} catch (error) {
				console.error("Error setting auth cookie:", error);
				Cookies.remove(COOKIE_NAME);
			}
		} else {
			// User is signed out
			Cookies.remove(COOKIE_NAME);
		}
	});
}

// Handle redirect after login
export function handleLoginRedirect(router) {
	const redirectPath = sessionStorage.getItem("redirectAfterLogin");
	if (redirectPath) {
		sessionStorage.removeItem("redirectAfterLogin");
		router.push(redirectPath);
	} else {
		router.push("/dashboard/portfolios");
	}
}
