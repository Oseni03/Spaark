"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

const OrganizationContext = createContext({});

export function OrganizationProvider({ children }) {
	const { organization } = useOrganization();
	const { userMemberships } = useOrganizationList();
	const [activeOrg, setActiveOrg] = useState(null);

	useEffect(() => {
		if (organization) {
			setActiveOrg(organization);
		}
	}, [organization]);

	const value = {
		organization: activeOrg,
		userMemberships,
		isAdmin: activeOrg?.membership?.role === "admin",
		isMember: activeOrg?.membership?.role === "member",
		canManagePortfolios:
			activeOrg?.membership?.role === "admin" ||
			activeOrg?.membership?.permissions?.includes("portfolio:manage"),
	};

	return (
		<OrganizationContext.Provider value={value}>
			{children}
		</OrganizationContext.Provider>
	);
}

export const useOrganizationContext = () => {
	const context = useContext(OrganizationContext);
	if (!context) {
		throw new Error(
			"useOrganizationContext must be used within an OrganizationProvider"
		);
	}
	return context;
};
