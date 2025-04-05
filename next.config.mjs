/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin"
const withNextIntl = createNextIntlPlugin("./src/utils/locales.js")

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  rewrites() {
    return [
      {
        source: "/bucket/:path*",
        destination: `${process.env.NEXT_PUBLIC_BUCKET}/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
