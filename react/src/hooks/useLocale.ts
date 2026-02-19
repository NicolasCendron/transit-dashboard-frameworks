import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { LOCALES, setStoredLocale } from "@common/i18n/locale";
import type { Locale } from "@common/i18n/locale";

export function useLocale() {
  const { t, i18n } = useTranslation();

  const localeOptions = useMemo(
    () => LOCALES.map(({ code, flag }) => ({ code, flag, label: t(`lang.${code}`) })),
    [t]
  );

  function setLocale(code: Locale) {
    i18n.changeLanguage(code);
    setStoredLocale(code);
  }

  const validLocales: Locale[] = ["en", "es", "pt"];
  const currentLocale = validLocales.includes(i18n.language as Locale) ? i18n.language as Locale : "en";
  return { t, locale: currentLocale, localeOptions, setLocale };
}
