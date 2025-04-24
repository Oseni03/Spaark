"use client";

import { useAuth } from "../context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// If not loading and no user, redirect to login
		if (!loading && !user) {
			// Store the intended destination for after login
			sessionStorage.setItem("redirectAfterLogin", pathname);
			router.push("/sign-in");
		}
	}, [user, loading, router, pathname]);

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	// If authenticated, render the children
	return user ? <>{children}</> : null;
}
