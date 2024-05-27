/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['.'],
  },
};

module.exports = nextConfig;
