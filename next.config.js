/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/xcs",
        destination: '/xcs/home',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
