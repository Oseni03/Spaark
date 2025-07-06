import { getPortfolio } from "@/services/portfolio";

async function sharedMetaData(params) {
	const validatedParams = await Promise.resolve(params);
	const { subdomain } = validatedParams;
	const { data: portfolio } = await getPortfolio(subdomain);
	const name = portfolio?.basics?.name || portfolio?.name || subdomain;
	const headline = portfolio?.basics?.headline;
	const summary = portfolio?.basics?.summary || `Welcome to ${name}'s blog!`;
	const picture = portfolio?.basics?.picture;

	return {
		title: {
			template: `%s | ${name}`,
			default: headline ? `${name} - ${headline}` : `${name} - Blogs`,
		},
		description: summary,
		openGraph: {
			title: headline ? `${name} - ${headline}` : `${name} - Blogs`,
			description: summary,
			images: picture ? [picture] : [],
			type: "profile",
			username: subdomain,
		},
		twitter: {
			card: "summary_large_image",
			title: headline ? `${name} - ${headline}` : `${name} - Blogs`,
			description: summary,
		},
		keywords: ["Next.js", "Sanity", "Tailwind CSS"],
		// Optionally add authors if available in portfolio
		// authors: [{ name }],
		robots: {
			index: true,
			follow: true,
		},
	};
}

export async function generateMetadata({ params }) {
	return await sharedMetaData(params);
}

export default function BlogLayout({ children }) {
	return <>{children}</>;
}
