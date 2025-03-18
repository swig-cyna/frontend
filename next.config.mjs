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
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
}

export default withNextIntl(nextConfig)
