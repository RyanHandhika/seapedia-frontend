import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { Button, Input } from "@/components/ui";
import { ROLE_HOME } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function RegisterPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.register(form);
      // Every account starts as BUYER — log straight in.
      await login(form.username, form.password);
      const activeRole = useAuthStore.getState().activeRole;
      toast.success("Account created — welcome aboard!");
      navigate(activeRole ? ROLE_HOME[activeRole] : "/buyer/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-2xl font-bold text-ink-900">Create your account</h2>
      <p className="mt-1 text-sm text-ink-500">
        Start as a buyer. Open a store or join as a driver anytime.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          hint="3–30 characters"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          hint="At least 8 characters"
          required
        />
        {error && <p className="text-sm text-coral-600">{error}</p>}
        <Button type="submit" fullWidth loading={loading}>Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
