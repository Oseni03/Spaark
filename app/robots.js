export default function robots() {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/bulder/, /studio/, /dashboard/",
		},
		sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
	};
}
