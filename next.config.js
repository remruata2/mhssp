/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	// Configure page extensions
	pageExtensions: ["ts", "tsx", "js", "jsx"],
	// Configure custom directory structure
	webpack: (config, { isServer }) => {
		// Add custom webpack config if needed
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
		domains: ["localhost"],
		unoptimized: process.env.NODE_ENV === "development",
	},
	async rewrites() {
		return [
			{
				source: "/uploads/:path*",
				destination: "/api/uploads/:path*",
			},
		];
	},
};
