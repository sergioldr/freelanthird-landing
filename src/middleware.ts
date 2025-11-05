import { defineMiddleware } from "astro:middleware";
import { defaultLang, languages } from "./i18n/ui";

const supportedLocales = Object.keys(languages);

/**
 * Detect the user's preferred language from Accept-Language header
 */
function detectBrowserLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) {
    return defaultLang;
  }

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0], // Get just the language part (en from en-US)
        quality: qValue ? Number.parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const lang of languages) {
    if (supportedLocales.includes(lang.code)) {
      return lang.code;
    }
  }

  return defaultLang;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, request } = context;

  const pathname = url.pathname;
  const [, urlLang] = pathname.split("/");

  // Allow Astro's image service and other static assets to pass through
  if (
    pathname.startsWith("/_image") ||
    pathname.startsWith("/_astro") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/site.webmanifest")
  ) {
    return next();
  }

  // Handle root path - redirect to appropriate language
  if (pathname === "/") {
    // 1. Check for preferred language cookie
    const preferredLang = cookies.get("preferred-lang")?.value;

    if (preferredLang && supportedLocales.includes(preferredLang)) {
      return redirect(`/${preferredLang}`, 302);
    }

    // 2. Detect from browser Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    const detectedLang = detectBrowserLanguage(acceptLanguage);

    return redirect(`/${detectedLang}`, 302);
  }

  // If URL has a supported locale, save it as user preference
  if (urlLang && supportedLocales.includes(urlLang)) {
    const langCookie = cookies.get("preferred-lang")?.value;

    if (langCookie !== urlLang) {
      cookies.set("preferred-lang", urlLang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
      });
    }

    return next();
  }

  // If path doesn't start with a supported locale, redirect to default language
  // This handles cases like /about -> /en/about
  if (!supportedLocales.includes(urlLang)) {
    const preferredLang = cookies.get("preferred-lang")?.value || defaultLang;
    const lang = supportedLocales.includes(preferredLang)
      ? preferredLang
      : defaultLang;

    return redirect(`/${lang}${pathname}`, 302);
  }

  return next();
});
