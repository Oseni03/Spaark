/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/:path*",
					has: [
						{
							type: "host",
							value: `(?<subdomain>[^.]+).${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
						},
					],
					destination: "/:subdomain/:path*",
				},
			],
		};
	},
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
};
export default nextConfig;
