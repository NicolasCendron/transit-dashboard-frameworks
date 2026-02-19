import { useLocale } from "@/hooks/useLocale";
import LangSelect from "./LangSelect";

export default function AppHeader() {
  const { t } = useLocale();
  return (
    <header className="app-header flex-between">
      <h1>
        {t("app.title")}
        <span className="framework-badge">React</span>
      </h1>
      <LangSelect />
    </header>
  );
}
