import usePageProps from './use_page_props'

export function useLocale() {
  const { locale } = usePageProps<{ locale: string }>()
  return locale
}

export default function useTranslate(scope?: string) {
  const { translations } = usePageProps<{
    translations: Record<string, string>
  }>()

  return (key: string) => {
    if (scope) {
      key = scope + '.' + key
    }
    return translations[key] || key
  }
}
