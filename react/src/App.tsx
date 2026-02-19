import AppRouter from "@/router";
import AppHeader from "@/components/AppHeader";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AppHeader />
      <main className="container">
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </main>
    </ErrorBoundary>
  );
}
