"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
	const { status } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// If not loading and no session, redirect to login
		if (status === "unauthenticated") {
			// Store the intended destination for after login
			sessionStorage.setItem("redirectAfterLogin", pathname);
			router.push("/sign-in");
		}
	}, [status, router, pathname]);

	// Show loading state while checking authentication
	if (status === "loading") {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	// If authenticated, render the children
	return status === "authenticated" ? <>{children}</> : null;
}
