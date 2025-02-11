"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { logger } from "@/lib/utils";

const OrganizationContext = createContext({});

export function OrganizationProvider({ children }) {
	const { organization } = useOrganization();
	const { userMemberships } = useOrganizationList();
	const [activeOrg, setActiveOrg] = useState(null);
	const [subscription, setSubscription] = useState(null);
	const portfolioCount = 4; // Fetch portfolio count here

	useEffect(() => {
		if (organization) {
			setActiveOrg(organization);
			fetchOrgSubscription(organization.id)
				.then(setSubscription)
				.catch(logger.error);
		}
	}, [organization]);

	const value = {
		organization: activeOrg,
		userMemberships,
		subscription,
		isAdmin: activeOrg?.membership?.role === "admin",
		isMember: activeOrg?.membership?.role === "member",
		canManagePortfolios:
			activeOrg?.membership?.role === "admin" ||
			activeOrg?.membership?.permissions?.includes("portfolio:manage"),
		canCreateOrganization: !activeOrg, // Only allow when not in an organization
		isIndividualAccount: !activeOrg,
		hasActiveSubscription:
			subscription?.status === "active" && subscription?.type === "TEAM",
		subscriptionType: subscription?.type || null,
		portfolioCount,
		portfolioLimit: subscription?.portfolioLimit || 1,
		hasReachedPortfolioLimit:
			portfolioCount >= (subscription?.portfolioLimit || 1),
		remainingPortfolios: Math.max(
			0,
			(subscription?.portfolioLimit || 1) - portfolioCount
		),
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

// Helper function to fetch organization subscription
async function fetchOrgSubscription(orgId) {
	try {
		const response = await fetch(
			`/api/organizations/${orgId}/subscription`
		);
		if (!response.ok) throw new Error("Failed to fetch subscription");
		return await response.json();
	} catch (error) {
		console.error("Error fetching organization subscription:", error);
		return null;
	}
}
