/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Cap server-action payloads at ~2 GB to match the largest course video upload.
      // Direct-to-R2 presigned uploads are the preferred path for large files; this is a safety net.
      bodySizeLimit: '2gb',
    },
  },

  // ESLint runs separately in Next 16 (no more `next lint` integration).
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
