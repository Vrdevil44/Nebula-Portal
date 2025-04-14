/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  // Disable SWC minification
  swcMinify: false,
  // Add experimental features
  experimental: {
    forceSwcTransforms: false,
  },
  // Ensure static export works properly
  distDir: 'out',
  // Add webpack configuration
  webpack: (config, { isServer }) => {
    // Add any necessary webpack configurations here
    return config;
  }
}

module.exports = nextConfig 