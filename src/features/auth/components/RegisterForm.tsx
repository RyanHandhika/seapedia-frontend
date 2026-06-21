// src/features/auth/components/RegisterForm.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShoppingBag, Store, Truck, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "../types/auth.schemas";
import { useRegister } from "../hooks/useRegister";
import { Input } from "@components/ui/Input/Input";
import { Button } from "@components/ui/Button/Button";
import { Alert } from "@components/ui/Alert/Alert";
import { cn } from "@utils/cn";
import type { Role } from "@types";

// Role options the user can pick at registration (Admin is excluded)
const ROLE_OPTIONS: {
  role: Role;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    role: "BUYER",
    label: "Pembeli",
    desc: "Belanja produk dari berbagai penjual",
    icon: ShoppingBag,
    color: "teal",
  },
  {
    role: "SELLER",
    label: "Penjual",
    desc: "Jual produk dan kelola toko kamu",
    icon: Store,
    color: "amber",
  },
  {
    role: "DRIVER",
    label: "Pengirim",
    desc: "Antar pesanan dan hasilkan pendapatan",
    icon: Truck,
    color: "blue",
  },
];

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
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { roles: ["BUYER"] }, // Default: Buyer is pre-selected
  });

  const password = watch("password", "");
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

        {/* Role selection checkboxes */}
        <div>
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-2">
            Pilih Peran
            <span className="text-red-500">*</span>
            <span
              title="Satu akun bisa punya lebih dari satu peran"
              className="text-slate-400 cursor-help"
            >
              <Info size={13} />
            </span>
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Pilih satu atau lebih peran. Kamu bisa ganti peran kapan saja.
          </p>

          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 gap-2">
                {ROLE_OPTIONS.map(
                  ({ role, label, desc, icon: Icon, color }) => {
                    const isSelected = field.value?.includes(role);
                    const borderMap: Record<string, string> = {
                      teal: "border-teal-500  bg-teal-50  text-teal-700",
                      amber: "border-amber-500 bg-amber-50 text-amber-700",
                      blue: "border-blue-500  bg-blue-50  text-blue-700",
                    };
                    return (
                      <label
                        key={role}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                          isSelected
                            ? borderMap[color]
                            : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isSelected}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...(field.value ?? []), role]
                              : (field.value ?? []).filter((r) => r !== role);
                            field.onChange(next);
                          }}
                        />
                        <Icon
                          size={18}
                          className={isSelected ? "" : "text-slate-400"}
                        />
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              !isSelected && "text-slate-700",
                            )}
                          >
                            {label}
                          </p>
                          <p className="text-xs text-slate-400">{desc}</p>
                        </div>
                        {isSelected && (
                          <span className="ml-auto text-lg">✓</span>
                        )}
                      </label>
                    );
                  },
                )}
              </div>
            )}
          />
          {errors.roles && (
            <p className="mt-1 text-xs text-red-500">
              ⚠ {errors.roles.message}
            </p>
          )}
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
