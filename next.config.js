/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel deploy için optimize edilmiş ayarlar
  swcMinify: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/embed.js',
        destination: '/embed',
      },
    ]
  },
}

module.exports = nextConfig

