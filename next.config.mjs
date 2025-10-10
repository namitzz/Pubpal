/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_REPOSITORY?.includes("namitzz/Pubpal");
const repoBase = "/Pubpal";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isPages ? { basePath: repoBase, assetPrefix: repoBase + "/" } : {}),
  trailingSlash: true,
  // Allow dynamic routes for static export
  // These will be generated during build
  generateBuildId: async () => {
    return 'pubpal-build'
  },
};

export default nextConfig;

