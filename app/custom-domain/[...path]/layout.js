import React from "react";
import { getPortfolioByDomain } from "@/services/portfolio";
import { logger, cn } from "@/lib/utils";
import NotFound from "@/app/not-found";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { BuildWithButton } from "@/components/build-with-button";
import { headers } from "next/headers";

export default async function CustomDomainLayout({ children }) {
	try {
		const headersList = headers();
		const domain =
			headersList.get("x-forwarded-host") || headersList.get("host");
		if (!domain) {
			return NotFound();
		}

		// Fetch portfolio by custom domain
		const portfolioResult = await getPortfolioByDomain(domain);
		logger?.info?.("Custom domain portfolio result: ", portfolioResult);

		if (!portfolioResult.success || !portfolioResult.data) {
			return NotFound();
		}

		const portfolio = portfolioResult.data;

		// Extract portfolio details for meta tags
		const name = portfolio.basics?.name || portfolio.name || domain;
		const headline = portfolio.basics?.headline;
		const picture = portfolio.basics?.picture;
		const summary = portfolio.basics?.summary || "Welcome to my portfolio!";

		const metaTags = {
			title: headline ? `${name} - ${headline}` : name,
			description: summary,
			image: picture,
			url: portfolio.customDomain || domain,
		};

		return (
			<div className={cn("scrollbar-hide", "overflow-y-auto")}>
				<BuildWithButton />
				<PortfolioProvider
					portfolio={portfolio}
					metaTags={metaTags}
					blogEnabled={portfolio.blogEnabled}
				>
					{children}
				</PortfolioProvider>
			</div>
		);
	} catch (error) {
		logger?.error?.(`Error loading portfolio for custom domain:`, error);
		return NotFound();
	}
}
