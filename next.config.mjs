/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração para subpath /bonus-gratis no Vercel (comentado para desenvolvimento local)
  // basePath: '/bonus-gratis',
  // assetPrefix: '/bonus-gratis',
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Headers configurados para basePath /bonus-gratis (comentado para desenvolvimento local)
  // async headers() {
  //   return [
  //     {
  //       source: '/bonus-gratis/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=(), microphone=(), geolocation=()',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/bonus-gratis/api/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 's-maxage=60, stale-while-revalidate',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/bonus-gratis/img/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ]
  // },
  // Redirects configurados para basePath /bonus-gratis (comentado para desenvolvimento local)
  // async redirects() {
  //   return [
  //     {
  //       source: '/bonus-gratis/home',
  //       destination: '/bonus-gratis/',
  //       permanent: true,
  //     },
  //     {
  //       source: '/bonus-gratis/inicio',
  //       destination: '/bonus-gratis/',
  //       permanent: true,
  //     },
  //   ]
  // },
}

export default nextConfig
