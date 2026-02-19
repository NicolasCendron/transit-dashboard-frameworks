import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { LOCALES, setStoredLocale } from "@common/i18n/locale";
import type { Locale } from "@common/i18n/locale";

export function useLocale() {
  const { t, locale } = useI18n();

  const localeOptions = computed(() =>
    LOCALES.map(({ code, flag }) => ({
      code,
      flag,
      label: t(`lang.${code}`),
    }))
  );

  function setLocale(code: Locale) {
    locale.value = code;
    setStoredLocale(code);
  }

  return {
    locale,
    localeOptions,
    t,
    setLocale,
  };
}
