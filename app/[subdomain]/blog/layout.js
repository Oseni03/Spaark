import { getPortfolio } from "@/services/portfolio";

export async function generateMetadata({ params }) {
	const validatedParams = await Promise.resolve(params);
	const { subdomain } = validatedParams;
	const portfolio = await getPortfolio(subdomain);
	const name =
		portfolio.data?.basics?.name || portfolio.data?.name || subdomain;

	return {
		title: `Blog`,
		description: `Read the latest posts from ${name}'s blog`,
	};
}

export default function BlogLayout({ children }) {
	return children;
}
