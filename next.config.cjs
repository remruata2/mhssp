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
		unoptimized: true,
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 0,
		disableStaticImages: false,
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			// Production configuration
			{
				protocol: "https",
				hostname: "mzhssp.in",
				port: "8443",
				pathname: "/uploads/**",
			},
			// Local development configuration
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/uploads/**",
			},
		],
		domains: ["localhost", "mzhssp.in"],
	},
	eslint: {
		dirs: ["src"],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
