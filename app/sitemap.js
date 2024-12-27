import { logger } from "@/lib/utils";
import { getUsers } from "@/services/user";

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
	const users = await getUsers();
	logger.info("Users: ", users);

	const userSitemapEntries = users?.data.map((user) => ({
		url: `https://${user.username}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
		lastModified: user.updatedAt.toISOString(),
		changeFrequency: "daily",
		priority: 0.9,
	}));

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

	return [...staticPages, ...userSitemapEntries];
}
