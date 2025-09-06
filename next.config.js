/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// swcMinify: true,
	experimental: {
		optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
	},

	productionBrowserSourceMaps: false,
	transpilePackages: ['crypto-js'],
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
				port: '',
				pathname: '**',
			},
		],
	},
	crossOrigin: 'anonymous',
};

module.exports = nextConfig;
