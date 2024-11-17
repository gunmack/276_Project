/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeFonts: true // Enables SWC optimization for fonts (needed for next/font)
  }
  // You can add more Next.js configuration here if needed
};

module.exports = nextConfig;
