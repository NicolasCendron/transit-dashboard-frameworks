import { useLocale } from "@/hooks/useLocale";
import LangSelect from "./LangSelect";
import TimezoneSelect from "./TimezoneSelect";

export default function AppHeader() {
  const { t } = useLocale();
  return (
    <header className="app-header flex-between">
      <h1>
        {t("app.title")}
        <span className="framework-badge">React</span>
      </h1>
      <div className="flex gap-1">
        <TimezoneSelect />
        <LangSelect />
      </div>
    </header>
  );
}
