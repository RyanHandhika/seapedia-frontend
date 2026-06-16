import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// ── placeholder pages (to be built in later days) ────────────────
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-400 text-sm mt-1">
        Coming soon — under construction
      </p>
    </div>
  </div>
);

// ── App layout ────────────────────────────────────────────────────
function Layout({ children }: { children: React.ReactNode }) {
  // TODO: replace with real auth state from AuthContext (Day 2)
  const user = null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={user}
        onLogout={() => console.log("logout")}
        onSwitchRole={() => console.log("switch role")}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <PlaceholderPage title="Product catalog" />
            </Layout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Layout>
              <PlaceholderPage title="Product detail" />
            </Layout>
          }
        />

        {/* Auth — no footer, full screen split layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/select-role"
          element={
            <Layout>
              <PlaceholderPage title="Select role" />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <PlaceholderPage title="Profile" />
            </Layout>
          }
        />

        {/* Dashboards (Day 2+) */}
        <Route
          path="/buyer/*"
          element={
            <Layout>
              <PlaceholderPage title="Buyer dashboard" />
            </Layout>
          }
        />
        <Route
          path="/seller/*"
          element={
            <Layout>
              <PlaceholderPage title="Seller dashboard" />
            </Layout>
          }
        />
        <Route
          path="/driver/*"
          element={
            <Layout>
              <PlaceholderPage title="Driver dashboard" />
            </Layout>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Layout>
              <PlaceholderPage title="Admin dashboard" />
            </Layout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <PlaceholderPage title="Page not found" />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
