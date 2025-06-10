/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove 'appDir' - it's now stable and enabled by default in Next.js 13.4+
  },
  images: {
    domains: ['via.placeholder.com', 'dl.dropboxusercontent.com'],
  },
}

module.exports = nextConfig