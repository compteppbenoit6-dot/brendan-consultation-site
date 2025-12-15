/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Increase the maximum body size for file uploads.
      // '50mb' is a generous limit for multiple high-resolution images.
      bodySizeLimit: '10000mb',
    },
  },
  
  // Your existing configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;