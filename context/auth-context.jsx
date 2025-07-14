"use client";

import { createContext, useContext, useEffect } from "react";
import { useSession, signOut as betterAuthSignOut } from "@/lib/auth-client";
import { logger } from "@/lib/utils";

// Provide proper default values for the context
const defaultAuthContext = {
	user: null,
	loading: true,
	signOut: async () => {},
};

const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export function AuthProvider({ children }) {
	const { data: session, status } = useSession();

	const signOut = async () => {
		try {
			await betterAuthSignOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/sign-in"); // redirect to login page
					},
				},
			});
			logger.info("User signed out");
		} catch (error) {
			logger.error("Sign out error:", error);
			throw error;
		}
	};

	// Convert session to user object to maintain compatibility
	const user = session?.user ?? null;
	const loading = status === "loading";

	useEffect(() => {
		if (user) {
			logger.info("User authenticated:", {
				userId: user.id,
				email: user.email,
			});
		}
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, loading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}
