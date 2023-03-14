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
      {
        source: "/home",
        destination: '/xcs/home',
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
