import { getPortfolio } from "@/services/portfolio";
import { transformPortfolio } from "./utils";

export async function getPortfolioFromSlug(subdomain) {
	try {
		const portfolioResult = await getPortfolio(subdomain);

		if (!portfolioResult.success || !portfolioResult.data) {
			return { success: false, error: "Portfolio not found" };
		}

		const portfolio = portfolioResult.data;
		const metaTags = {
			title: portfolio.basics?.name || subdomain,
			description:
				portfolio.basics?.summary || "Welcome to my portfolio!",
			image: portfolio.basics?.picture,
			url: portfolio.customDomain
				? portfolio.customDomain
				: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		};

		return {
			success: true,
			data: { portfolio, metaTags },
		};
	} catch (error) {
		console.error("Error fetching portfolio:", error);
		return { success: false, error: "Failed to fetch portfolio" };
	}
}
