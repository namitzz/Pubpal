/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // Using client-side localStorage, so we need dynamic rendering
  // output: "export" is removed to allow dynamic routes
};

export default nextConfig;


