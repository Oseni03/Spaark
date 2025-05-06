"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { upsertUser } from "@/services/user";
import { logger } from "@/lib/utils";
import { initAuthCookies } from "@/lib/firebase/auth-cookies";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const signOut = async () => {
		try {
			await firebaseSignOut(auth);
			logger.info("User signed out successfully");
		} catch (error) {
			logger.error("Error signing out:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				try {
					// First upsert the user to ensure we have a record
					const dbUser = await upsertUser({
						id: firebaseUser.uid,
						email: firebaseUser.email,
					});

					// Combine Firebase user with database user data
					setUser({
						id: dbUser.data.id,
						email: dbUser.data.email,
						subscription: dbUser.data?.subscription,
						emailVerified: firebaseUser.emailVerified,
						displayName: firebaseUser.displayName || undefined,
						photoURL: firebaseUser.photoURL || undefined,
					});

					logger.info("User authenticated:", {
						id: dbUser.id,
						email: dbUser.email,
					});
				} catch (error) {
					logger.error("Error syncing user data:", error);
					setUser(null);
				}
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		// Initialize cookie management
		const cookieCleanup = initAuthCookies();

		return () => {
			unsubscribe();
			if (cookieCleanup) cookieCleanup();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}
