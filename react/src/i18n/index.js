import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@common/i18n/en";
import es from "@common/i18n/es";
import pt from "@common/i18n/pt";
import { getDefaultLocale } from "@common/i18n/locale";
i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        es: { translation: es },
        pt: { translation: pt },
    },
    lng: getDefaultLocale(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});
export default i18n;
