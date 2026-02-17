/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@kit/ui'],
  typescript: { ignoreBuildErrors: true },
  experimental: {
    optimizePackageImports: ['@kit/ui', 'lucide-react'],
  },
};

export default config;
