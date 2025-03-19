"use server"

import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const COOKIE_NAME = "locale"

export default getRequestConfig(async () => {
  const locale = (await getLocale()) || "en"

  return {
    locale,
    messages: (await import(`@/locales/${locale}.json`)).default,
  }
})

export const getLocale = () => {
  const locale = cookies().get(COOKIE_NAME)?.value || "en"

  return locale
}

export const setLocale = (locale) => {
  cookies().set(COOKIE_NAME, locale)
}
