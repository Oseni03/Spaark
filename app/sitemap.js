import { getBlogPosts } from "@/services/blog";
import { getAllPortfolios } from "@/services/portfolio";
import { client } from "@/sanity/lib/client";
import { postSlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

	// Fetch data with null checks
	const portfolios = await getAllPortfolios();
	const blogPosts = (await client.fetch(postSlugsQuery)) || [];

	const portfolioSitemapEntries = portfolios?.data?.map((portfolio) => ({
		url: portfolio.customDomain
			? portfolio.customDomain
			: `https://${portfolio.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		lastModified: new Date().toISOString(),
		changeFrequency: "daily",
		priority: 0.9,
	}));

	// Fetch and process blog entries for each portfolio
	const blogsSitemapEntries = await Promise.all(
		portfolios.data?.map(async (portfolio) => {
			const blogs = await getBlogPosts(portfolio.id);
			return blogs.data?.map((blog) => ({
				url: portfolio.customDomain
					? `${portfolio.customDomain}/blog/post/${blog.slug}`
					: `https://${portfolio.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/post/${blog.slug}`,
				lastModified: new Date(
					blog.updatedAt || new Date()
				).toISOString(),
				changeFrequency: "daily",
				priority: 0.9,
			}));
		})
	);

	// Flatten the array of arrays
	const flattenedBlogEntries = blogsSitemapEntries.flat();

	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date().toISOString(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseUrl}/contact-us`,
			lastModified: new Date().toISOString(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date().toISOString(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: new Date().toISOString(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
	];

	const blogSitemapEntries = blogPosts.map((post) => ({
		url: `${baseUrl}/blog/post/${post.slug}`,
		lastModified: new Date(post?.date || new Date()).toISOString(),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	return [
		...staticPages,
		...portfolioSitemapEntries,
		...flattenedBlogEntries,
		...blogSitemapEntries,
	];
}
