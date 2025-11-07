/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuração para subpath /bonus-gratis no Vercel
  basePath: '/bonus-gratis',
  assetPrefix: '/bonus-gratis',
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        // SEM o basePath - o Next.js adiciona automaticamente quando basePath está configurado
        // Captura a rota raiz e todas as sub-rotas
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // SEM o basePath - o Next.js adiciona automaticamente
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate',
          },
        ],
      },
      {
        // SEM o basePath - o Next.js adiciona automaticamente
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        // SEM o basePath - o Next.js adiciona automaticamente quando basePath está configurado
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        // SEM o basePath - o Next.js adiciona automaticamente
        source: '/inicio',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
