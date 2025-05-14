/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// Apply these headers to all routes
				source: "/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Credentials",
						value: "true",
					},
					{
						key: "Access-Control-Allow-Origin",
						value: process.env.NEXT_PUBLIC_APP_URL,
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, x-clerk-auth-status, x-clerk-auth-reason",
					},
				],
			},
		];
	},
	images: {
		domains: [
			"cdn.sanity.io",
			"images.unsplash.com",
			"assets.aceternity.com",
			"cdn.simpleicons.org",
			"sftechhack.com",
			"globalai-hackathon.com",
		],
	},
};
export default nextConfig;
