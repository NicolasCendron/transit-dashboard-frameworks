import { createI18n } from "vue-i18n";
import en from "@common/i18n/en";
import es from "@common/i18n/es";
import pt from "@common/i18n/pt";
import { getDefaultLocale } from "@common/i18n/locale";

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: "en",
  messages: { en, es, pt },
});

export default i18n;
