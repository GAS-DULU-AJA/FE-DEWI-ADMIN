"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { ROLE_DASHBOARD_PATH } from "@/lib/constants";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const t = useTranslations("auth");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const success = await login(data.email, data.password);
    if (success) {
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        if (!authStore.user.isApproved) {
          router.push("/pending-approval");
          return;
        }
        const path = ROLE_DASHBOARD_PATH[authStore.user.role];
        router.push(path);
      }
    } else {
      setError(t("invalidCredentials"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          error={errors.email?.message ? t(errors.email.message as "emailRequired" | "emailInvalid") : undefined}
          {...register("email")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            className="pr-10"
            error={errors.password?.message ? t(errors.password.message as "passwordRequired" | "passwordMin") : undefined}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span />
        <button
          type="button"
          onClick={() => alert(t("forgotPasswordNotAvailable"))}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {t("forgotPassword")}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        <LogIn className="h-4 w-4" />
        {t("login")}
      </Button>

      <p className="text-center text-sm text-stone-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
          {t("registerHere")}
        </Link>
      </p>
    </form>
  );
}
