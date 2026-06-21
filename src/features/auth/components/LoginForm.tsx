// src/features/auth/components/LoginForm.tsx
//
// REACT-HOOK-FORM + ZOD PATTERN (used throughout SEAPEDIA):
//   1. Define schema with Zod (in auth.schemas.ts)
//   2. useForm({ resolver: zodResolver(schema) })
//   3. register() each field
//   4. formState.errors shows field-level validation errors
//   5. handleSubmit() only calls your function if ALL fields are valid

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../types/auth.schemas";
import { useLogin } from "../hooks/useLogin";
import { Input } from "@components/ui/Input/Input";
import { Button } from "@components/ui/Button/Button";
import { Alert } from "@components/ui/Alert/Alert";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => login.mutate(data);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h1 className="text-2xl font-bold font-display text-slate-800 mb-1">
        Selamat Datang!
      </h1>
      <p className="text-slate-500 text-sm mb-6">Masuk ke akun SEAPEDIA kamu</p>

      {/* API-level error (e.g. "Email atau password salah") */}
      {login.isError && (
        <Alert type="error" className="mb-4">
          {login.error instanceof Error
            ? login.error.message
            : "Login gagal. Coba lagi."}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="kamu@email.com"
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password"
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

        <Button
          type="submit"
          fullWidth
          isLoading={login.isPending}
          className="mt-2"
        >
          Masuk
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="text-teal-600 font-medium hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
