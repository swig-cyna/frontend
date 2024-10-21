"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

const ThemeProvider = ({ children, ...props }) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
)

export default ThemeProvider
