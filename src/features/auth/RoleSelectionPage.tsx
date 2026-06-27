import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button, Logo } from "@/components/ui";
import { cn, ROLE_HOME, ROLE_LABEL } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import type { SwitchableRole } from "@/types";

const ROLE_COPY: Record<SwitchableRole, { tag: string; desc: string; tone: string }> = {
  BUYER: {
    tag: "Shop fresh",
    desc: "Browse stores, fill your cart, and track every delivery.",
    tone: "from-brand-500 to-brand-600",
  },
  SELLER: {
    tag: "Run your store",
    desc: "List products, manage orders, and watch your income grow.",
    tone: "from-coral-400 to-coral-600",
  },
  DRIVER: {
    tag: "Deliver & earn",
    desc: "Take delivery jobs and get paid for every completed trip.",
    tone: "from-ink-600 to-ink-800",
  },
};

export function RoleSelectionPage() {
  const pending = useAuthStore((s) => s.pending);
  const status = useAuthStore((s) => s.status);
  const complete = useAuthStore((s) => s.completeRoleSelection);
  const navigate = useNavigate();
  const [busy, setBusy] = useState<SwitchableRole | null>(null);

  // If there is no pending selection and the user is already authenticated,
  // they don't belong here.
  if (!pending && status === "authenticated") {
    const role = useAuthStore.getState().activeRole;
    return <Navigate to={role ? ROLE_HOME[role] : "/"} replace />;
  }
  if (!pending) return <Navigate to="/auth/login" replace />;

  const choices = pending.roles.filter(
    (r): r is SwitchableRole => r !== "ADMIN",
  );

  async function choose(role: SwitchableRole) {
    setBusy(role);
    try {
      const active = await complete(role);
      toast.success(`Continuing as ${ROLE_LABEL[active]}`);
      navigate(ROLE_HOME[active]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not select role");
      setBusy(null);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 px-4 py-10">
      <div className="w-full max-w-2xl animate-fade-up">
        <div className="mb-8 text-center">
          <Logo className="text-2xl text-white [&_span]:text-white" />
          <h1 className="mt-6 font-display text-2xl font-bold text-white">
            How do you want to continue?
          </h1>
          <p className="mt-1 text-sm text-ink-300">
            Your account has more than one role. Pick one — you can switch later.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {choices.map((role) => {
            const copy = ROLE_COPY[role];
            return (
              <button
                key={role}
                onClick={() => choose(role)}
                disabled={!!busy}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-left text-white transition-transform",
                  "hover:-translate-y-1 disabled:opacity-60",
                  copy.tone,
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {copy.tag}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold">{ROLE_LABEL[role]}</h3>
                <p className="mt-2 text-sm opacity-90">{copy.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  {busy === role ? "Entering…" : "Continue →"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
