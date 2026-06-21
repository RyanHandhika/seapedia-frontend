// src/features/auth/components/RegisterForm.tsx
//
// Registration is now intentionally simple: username, email,
// password. No role checkboxes — every new account is automatically
// a BUYER (see useRegister.ts / backend). Seller and Driver are
// acquired later from the Account page (see RoleUpgradeCard.tsx),
// matching how Shopee/Tokopedia onboard sellers after signup rather
// than during it.

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "../types/auth.schemas";
import { useRegister } from "../hooks/useRegister";
import { Input } from "@components/ui/Input/Input";
import { Button } from "@components/ui/Button/Button";
import { Alert } from "@components/ui/Alert/Alert";
import { cn } from "@utils/cn";

// Simple password strength indicator
function getPasswordStrength(password: string): {
  label: string;
  color: string;
  width: string;
} {
  if (password.length === 0)
    return { label: "", color: "bg-slate-200", width: "w-0" };
  if (password.length < 6)
    return { label: "Lemah", color: "bg-red-400", width: "w-1/3" };
  if (password.length < 10)
    return { label: "Sedang", color: "bg-amber-400", width: "w-2/3" };
  return { label: "Kuat", color: "bg-green-500", width: "w-full" };
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const register_ = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const strength = getPasswordStrength(password);
  const onSubmit = (data: RegisterFormValues) => register_.mutate(data);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h1 className="text-2xl font-bold font-display text-slate-800 mb-1">
        Buat Akun
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Bergabung dengan SEAPEDIA hari ini
      </p>

      {register_.isError && (
        <Alert type="error" className="mb-4">
          {register_.error instanceof Error
            ? register_.error.message
            : "Registrasi gagal."}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Username"
          placeholder="nama_kamu"
          error={errors.username?.message}
          required
          {...register("username")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="kamu@email.com"
          error={errors.email?.message}
          required
          {...register("email")}
        />

        {/* Password with strength meter */}
        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 karakter"
            error={errors.password?.message}
            required
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("password")}
          />
          {password.length > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    strength.color,
                    strength.width,
                  )}
                />
              </div>
              <span className="text-xs text-slate-500">{strength.label}</span>
            </div>
          )}
        </div>

        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          error={errors.confirmPassword?.message}
          required
          {...register("confirmPassword")}
        />

        {/* Info banner: explains the new account model instead of asking the user to choose */}
        <div className="flex items-start gap-2.5 bg-teal-50 border border-teal-100 rounded-xl p-3.5">
          <ShoppingBag size={16} className="text-teal-600 shrink-0 mt-0.5" />
          <p className="text-xs text-teal-700 leading-relaxed">
            Akun kamu otomatis terdaftar sebagai <strong>Pembeli</strong>. Kamu
            bisa upgrade jadi <strong>Penjual</strong> atau{" "}
            <strong>Pengirim</strong> kapan saja dari halaman Akun setelah
            masuk.
          </p>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={register_.isPending}
          className="mt-2"
        >
          Buat Akun
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-teal-600 font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
