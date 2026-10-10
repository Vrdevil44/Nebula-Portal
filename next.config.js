/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Nebula-Portal',
  assetPrefix: '/Nebula-Portal/',
  env: { NEXT_PUBLIC_BASE_PATH: '/Nebula-Portal' },
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
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  }
}

module.exports = nextConfig 