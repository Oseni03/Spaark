import { getBlogPosts } from "@/services/blog";
import { getAllPortfolios } from "@/services/portfolio";

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

	// Fetch data with null checks
	let portfolios = [];
	try {
		portfolios = await getAllPortfolios();
		console.log("Portfolios fetched:", portfolios?.length || 0);
	} catch (error) {
		console.warn("Failed to fetch portfolios:", error);
		portfolios = [];
	}

	// Only fetch Sanity blog posts if environment variables are configured
	let blogPosts = [];
	if (
		process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
		process.env.NEXT_PUBLIC_SANITY_DATASET
	) {
		try {
			const { client } = await import("@/sanity/lib/client");
			const { postSlugsQuery } = await import("@/sanity/lib/queries");
			blogPosts = (await client.fetch(postSlugsQuery)) || [];
			console.log("Sanity blog posts fetched:", blogPosts?.length || 0);
		} catch (error) {
			console.warn("Failed to fetch Sanity blog posts:", error);
			blogPosts = [];
		}
	}

	// Ensure portfolios is an array and handle null/undefined cases
	console.log(
		"Portfolios type:",
		typeof portfolios,
		"Is array:",
		Array.isArray(portfolios)
	);
	const portfolioSitemapEntries = (
		Array.isArray(portfolios) ? portfolios : []
	).map((portfolio) => ({
		url: portfolio.customDomain
			? portfolio.customDomain
			: `https://${portfolio.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		lastModified: new Date().toISOString(),
		changeFrequency: "daily",
		priority: 0.9,
	}));

	// Fetch and process blog entries for each portfolio
	const blogsSitemapEntries = await Promise.all(
		(Array.isArray(portfolios) ? portfolios : []).map(async (portfolio) => {
			try {
				const blogs = await getBlogPosts(portfolio.id);
				console.log(
					`Blogs for portfolio ${portfolio.id}:`,
					blogs?.length || 0
				);
				return (Array.isArray(blogs) ? blogs : []).map((blog) => ({
					url: portfolio.customDomain
						? `${portfolio.customDomain}/blog/post/${blog.slug}`
						: `https://${portfolio.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/post/${blog.slug}`,
					lastModified: new Date(
						blog.updatedAt || new Date()
					).toISOString(),
					changeFrequency: "daily",
					priority: 0.9,
				}));
			} catch (error) {
				console.warn(
					`Failed to fetch blogs for portfolio ${portfolio.id}:`,
					error
				);
				return [];
			}
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

	console.log(
		"Blog posts type:",
		typeof blogPosts,
		"Is array:",
		Array.isArray(blogPosts)
	);
	const blogSitemapEntries = (Array.isArray(blogPosts) ? blogPosts : []).map(
		(post) => ({
			url: `${baseUrl}/blog/post/${post.slug?.current || post.slug}`,
			lastModified: new Date(
				post?._createdAt || post?.date || new Date()
			).toISOString(),
			changeFrequency: "weekly",
			priority: 0.7,
		})
	);

	const finalSitemap = [
		...staticPages,
		...portfolioSitemapEntries,
		...flattenedBlogEntries,
		...blogSitemapEntries,
	];

	console.log("Final sitemap entries:", finalSitemap.length);
	return finalSitemap;
}
