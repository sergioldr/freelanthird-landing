import { defaultLang, ui } from './ui'

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/')
	if (lang in ui) {
		return lang as keyof typeof ui
	}
	return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key]
	}
}

/**
 * Generate a localized URL path
 * @param lang - The language code
 * @param path - The path without leading slash (e.g., 'about', 'blog/post')
 * @returns The localized path with proper prefix
 */
export function getLocalizedPath(lang: keyof typeof ui, path = ''): string {
	const cleanPath = path.startsWith('/') ? path.slice(1) : path
	// Always include language prefix now (since prefixDefaultLocale is true)
	return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`
}
