/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Configure page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Configure custom directory structure
  webpack: (config, { isServer }) => {
    // Add custom webpack config if needed
    return config;
  },
}
