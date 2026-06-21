import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "@router/index";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useAppInit } from "@hooks/useAppInit";
import { useUIStore } from "@stores/uiStore";
import { Spinner } from "@components/ui/Spinner/Spinner";

// ── QUERY CLIENT ───────────────────────────────────────────
// Global defaults for all TanStack Query calls in the app.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data is "fresh" for 1 minute
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: true, // Refetch when user returns to tab
    },
  },
});

// Inner component so useAppInit can use QueryClient via hooks
function AppShell() {
  useAppInit(); // Hydrates auth state from localStorage token

  const isPageLoading = useUIStore((s) => s.isPageLoading);

  // Full-screen branded loader while auth initializes
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-teal-50 to-emerald-50">
        <span className="text-2xl font-extrabold font-display bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
          SEAPEDIA
        </span>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      {/* DevTools only renders in development mode */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
