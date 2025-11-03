/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
	reactStrictMode: false, // Disable in dev for faster renders
	typescript: {
		ignoreBuildErrors: true,
		// Add this for faster dev builds:
		tsconfigPath: './tsconfig.json',
	},
	output: 'export',
	images: {
		unoptimized: true,
	},
	experimental: {
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
	},
};

export default nextConfig;
