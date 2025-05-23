"use client";

import React, { createContext, useContext } from "react";

const PortfolioContext = createContext(null);

export const usePortfolio = () => {
	const context = useContext(PortfolioContext);
	if (!context) {
		throw new Error("usePortfolio must be used within a PortfolioProvider");
	}
	return context;
};

export const PortfolioProvider = ({
	portfolio,
	metaTags,
	blogEnabled,
	children,
}) => {
	return (
		<PortfolioContext.Provider value={{ portfolio, metaTags, blogEnabled }}>
			{children}
		</PortfolioContext.Provider>
	);
};
