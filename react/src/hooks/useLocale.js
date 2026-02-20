import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { LOCALES, setStoredLocale } from "@common/i18n/locale";
export function useLocale() {
    const { t, i18n } = useTranslation();
    const localeOptions = useMemo(() => LOCALES.map(({ code, flag }) => ({ code, flag, label: t(`lang.${code}`) })), [t]);
    function setLocale(code) {
        i18n.changeLanguage(code);
        setStoredLocale(code);
    }
    const validLocales = ["en", "es", "pt"];
    const currentLocale = validLocales.includes(i18n.language) ? i18n.language : "en";
    return { t, locale: currentLocale, localeOptions, setLocale };
}
