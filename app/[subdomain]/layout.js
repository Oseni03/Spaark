import React from "react";
import { z } from "zod";
import { PORTFOLIO_TAILWIND_CLASS } from "@/utils/constants";
import { getPortfolio } from "@/services/portfolio";
import { logger, transformPortfolio } from "@/lib/utils";
import NotFound from "../not-found";
import { cn } from "@/lib/utils";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { BuildWithButton } from "@/components/build-with-button";

// Input validation schema
const ParamsSchema = z.object({
	subdomain: z.string().min(1, "Portfolio slug is required"),
});

export default async function PortfolioLayout({ params, children }) {
	try {
		// Await and validate params
		const resolvedParams = await Promise.resolve(params);
		const validationResult = ParamsSchema.safeParse(resolvedParams);

		if (!validationResult.success) {
			logger.error("Slug validation error: ", validationResult.error);
			return NotFound();
		}

		const { subdomain: portfolioSlug } = validationResult.data;

		// Fetch portfolio by slug
		const portfolioResult = await getPortfolio(portfolioSlug);
		logger.info("Portfolio result: ", portfolioResult);

		if (!portfolioResult.success || !portfolioResult.data) {
			return NotFound();
		}

		// Transform the portfolio data
		const portfolio = portfolioResult.data;

		// Extract portfolio details for meta tags
		const name = portfolio.basics?.name || portfolioSlug;
		const headline = portfolio.basics?.headline;
		const picture = portfolio.basics?.picture;
		const summary = portfolio.basics?.summary || "Welcome to my portfolio!";

		// Meta tags
		const metaTags = {
			title: headline ? `${name} - ${headline}` : name,
			description: summary,
			image: picture,
			url: portfolio.customDomain
				? portfolio.customDomain
				: `${portfolioSlug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		};

		return (
			<div
				className={cn(
					"scrollbar-hide",
					"overflow-y-auto",
					portfolio.metadata.theme?.background &&
						`bg-[${portfolio.metadata.theme.background}]`,
					portfolio.metadata.theme?.text &&
						`text-[${portfolio.metadata.theme.text}]`
				)}
			>
				<BuildWithButton />
				<PortfolioProvider
					portfolio={portfolio}
					metaTags={metaTags}
					blogEnabled={portfolio.blogEnabled}
				>
					{children}
				</PortfolioProvider>
			</div>
		)
	} catch (error) {
		logger.error(`Error loading portfolio for ${portfolioSlug}:`, error);
		return NotFound();
	}
}

// Update the generateMetadata function to include all meta information
export async function generateMetadata({ params }) {
	const validatedParams = await Promise.resolve(params);
	const { subdomain } = validatedParams;
	const portfolio = await getPortfolio(subdomain);

	const name = portfolio.data?.basics?.name || portfolio.data?.name;
	const headline = portfolio.data?.basics?.headline;
	const summary = portfolio.data?.basics?.summary;
	const picture = portfolio.data?.basics?.picture;

	return {
		title: {
			template: `%s | ${name}`,
			default: headline ? `${name} - ${headline}` : name,
		},
		description: summary || `${name}'s Portfolio`,
		openGraph: {
			title: headline ? `${name} - ${headline}` : name,
			description: summary,
			images: picture ? [picture] : [],
			type: "profile",
			username: subdomain,
		},
		twitter: {
			card: "summary",
			title: headline ? `${name} - ${headline}` : name,
			description: summary,
		},
	};
}
