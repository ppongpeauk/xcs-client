/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["cdn.discordapp.com", "media.discordapp.net", "barcodeapi.org"],
  },
  async redirects() {
    return [
      {
        source: "/xcs/:path*",
        destination: '/platform/:path*',
        permanent: true,
      },
      {
        source: "/platform",
        destination: '/platform/home',
        permanent: true,
      },
      {
        source: "/home",
        destination: '/platform/home',
        permanent: true,
      },
      {
        source: "/login",
        destination: '/ldp',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
