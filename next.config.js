/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://nextjs.org/docs/messages/static-page-generation-timeout
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
