"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/navigation";
import { Building2, BedDouble, ShoppingBag, CalendarDays, UserPlus } from "lucide-react";
import type { PartnerRole } from "@/types";

const ROLE_OPTIONS: { value: PartnerRole; icon: React.ReactNode; labelKey: string; descKey: string; color: string }[] = [
  { value: "VILLAGE_ADMIN", icon: <Building2 className="h-5 w-5" />, labelKey: "villageAdmin", descKey: "villageAdminDesc", color: "border-emerald-500 bg-emerald-50 text-emerald-700" },
  { value: "ACCOMMODATION", icon: <BedDouble className="h-5 w-5" />, labelKey: "accommodation", descKey: "accommodationDesc", color: "border-blue-500 bg-blue-50 text-blue-700" },
  { value: "UMKM", icon: <ShoppingBag className="h-5 w-5" />, labelKey: "umkm", descKey: "umkmDesc", color: "border-amber-500 bg-amber-50 text-amber-700" },
  { value: "EVENT_ORGANIZER", icon: <CalendarDays className="h-5 w-5" />, labelKey: "eventOrganizer", descKey: "eventOrganizerDesc", color: "border-violet-500 bg-violet-50 text-violet-700" },
];

export function RegisterForm() {
  const t = useTranslations("auth");
  const tp = useTranslations("partner");
  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("partnerType");

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.partnerType as PartnerRole,
      organizationName: data.organizationName,
      address: data.address,
      password: data.password,
    });
    if (success) {
      router.push("/pending-approval");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Partner Type Selector */}
      <div className="space-y-2">
        <Label>{t("partnerType")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("partnerType", opt.value, { shouldValidate: true })}
              className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                selectedRole === opt.value
                  ? opt.color + " border-opacity-100"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${selectedRole === opt.value ? "" : "text-stone-400"}`}>
                {opt.icon}
              </span>
              <div>
                <p className="text-xs font-semibold">{tp(opt.labelKey as "villageAdmin" | "accommodation" | "umkm" | "eventOrganizer")}</p>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-tight hidden sm:block">{tp(opt.descKey as "villageAdminDesc" | "accommodationDesc" | "umkmDesc" | "eventOrganizerDesc")}</p>
              </div>
            </button>
          ))}
        </div>
        {errors.partnerType && (
          <p className="text-xs text-red-500">{t("partnerTypeRequired")}</p>
        )}
      </div>

      {/* Full Name + Phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t("fullName")}</Label>
          <Input id="fullName" placeholder={t("fullNamePlaceholder")} error={errors.fullName?.message ? t("nameRequired") : undefined} {...register("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" placeholder={t("phonePlaceholder")} {...register("phone")} />
        </div>
      </div>

      {/* Organization Name */}
      <div className="space-y-2">
        <Label htmlFor="organizationName">{t("organizationName")}</Label>
        <Input id="organizationName" placeholder={t("organizationPlaceholder")} {...register("organizationName")} />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" placeholder={t("emailPlaceholder")} error={errors.email?.message ? t("emailInvalid") : undefined} {...register("email")} />
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" placeholder={t("passwordPlaceholder")} error={errors.password?.message ? t("passwordMin") : undefined} {...register("password")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input id="confirmPassword" type="password" placeholder={t("confirmPasswordPlaceholder")} error={errors.confirmPassword?.message ? t("passwordMismatch") : undefined} {...register("confirmPassword")} />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">{t("address")}</Label>
        <Textarea id="address" placeholder={t("addressPlaceholder")} rows={2} {...register("address")} />
      </div>

      {/* Agree Terms */}
      <div className="flex items-start gap-3 rounded-lg bg-stone-50 border border-stone-200 p-3">
        <input
          type="checkbox"
          id="agreeTerms"
          className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-emerald-600"
          {...register("agreeTerms")}
        />
        <label htmlFor="agreeTerms" className="text-sm text-stone-600 cursor-pointer">
          {t("agreeTerms")}
        </label>
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        <UserPlus className="h-4 w-4" />
        {t("register")}
      </Button>

      <p className="text-center text-sm text-stone-500">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
          {t("loginHere")}
        </Link>
      </p>
    </form>
  );
}
