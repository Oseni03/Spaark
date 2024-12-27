export default function robots() {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/bulder/",
		},
		sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
	};
}
