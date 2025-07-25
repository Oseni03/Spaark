"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as betterAuthSignOut } from "@/lib/auth-client";
import { logger } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getSubscriptionDetails } from "@/services/subscription";

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
	const { data: session, isPending } = useSession();
	const [subscription, setSubscription] = useState(null);
	const router = useRouter();

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

	useEffect(() => {
		if (user) {
			logger.info("User authenticated:", {
				userId: user.id,
				email: user.email,
			});

			const getUserSubscription = async () => {
				const subscription = await getSubscriptionDetails();
				if (subscription.error) {
					logger.error("Failed to fetch user subscription");
					return;
				}

				setSubscription(subscription);
				logger.info("User subscription: ", subscription);
			};

			getUserSubscription();
		}
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user: { ...user, subscription },
				loading: isPending,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
