"use client";

import React, { createContext, useContext } from "react";

// Create the UserContext
const UserContext = createContext(null);

// Custom hook for consuming the context
export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

// Provider component
export const UserProvider = ({ user, metaTags, children }) => {
	return (
		<UserContext.Provider value={{ user, metaTags }}>
			{children}
		</UserContext.Provider>
	);
};
