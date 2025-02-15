import { updatePortfolioInDatabase } from "@/redux/thunks/portfolio";
import {
	addDomainToVercel,
	removeDomainFromVercelProject,
} from "@/lib/domains";

export async function updateDomain({
	portfolioId,
	domain,
	dispatch,
	portfolio,
}) {
	try {
		// Add domain to Vercel
		if (domain) {
			await addDomainToVercel(domain);
		}

		// If there's an existing domain and it's different, remove it
		if (portfolio.customDomain && portfolio.customDomain !== domain) {
			await removeDomainFromVercelProject(portfolio.customDomain);
		}

		// Update portfolio in database
		await dispatch(
			updatePortfolioInDatabase({
				id: portfolioId,
				data: { ...portfolio, customDomain: domain },
			})
		).unwrap();

		return { success: true };
	} catch (error) {
		console.error("Error updating domain:", error);
		return { success: false, error: error.message };
	}
}
