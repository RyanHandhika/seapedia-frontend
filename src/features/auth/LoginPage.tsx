import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button, Input } from "@/components/ui";
import { ROLE_HOME } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login(form.usernameOrEmail, form.password);
      if (result.requiresRoleSelection) {
        navigate("/role-selection");
        return;
      }
      // Active role comes from the freshly-decoded token.
      const activeRole = useAuthStore.getState().activeRole;
      toast.success("Welcome back!");
      navigate(activeRole ? ROLE_HOME[activeRole] : "/");
    } catch (err) {
      // Friendlier message for the most common case (wrong username/password),
      // falling back to the server message for anything else.
      const message =
        err instanceof ApiException
          ? err.message.toLowerCase().includes("invalid")
            ? "Incorrect username or password. Please try again."
            : err.message
          : "Login failed. Please check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-2xl font-bold text-ink-900">
        Welcome back
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Log in to your SEAPEDIA account.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* Inline error alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700 animate-fade-up"
          >
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Username or email"
          name="usernameOrEmail"
          autoComplete="username"
          value={form.usernameOrEmail}
          onChange={(e) =>
            setForm({ ...form, usernameOrEmail: e.target.value })
          }
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        New here?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-brand-600 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-ink-100 bg-white p-4 text-xs text-ink-500">
        <p className="mb-1 font-semibold text-ink-700">
          Demo accounts (password: Password123!)
        </p>
        <ul className="space-y-0.5">
          <li>buyer_demo · seller_demo · driver_demo · admin</li>
        </ul>
      </div>
    </div>
  );
}
