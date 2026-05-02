"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
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
import type { PartnerRole } from "@/types";

type LoginRoleChoice = "village" | "hotel" | "sme" | "experience" | "transport";

const ROLE_CHOICES: Array<{
  id: LoginRoleChoice;
  icon: string;
  labelId: string;
  labelEn: string;
  descId: string;
  descEn: string;
  allowedRoles: PartnerRole[];
  accentClass: string;
}> = [
  {
    id: "village",
    icon: "🏘️",
    labelId: "Pengelola Desa",
    labelEn: "Village Manager",
    descId: "Kelola profil desa, experience, event & mitra",
    descEn: "Manage village profile, experiences, events, and partners",
    allowedRoles: ["VILLAGE_ADMIN"],
    accentClass: "border-primary/60 bg-primary/10",
  },
  {
    id: "hotel",
    icon: "🏠",
    labelId: "Pemilik Penginapan",
    labelEn: "Accommodation Owner",
    descId: "Kelola kamar, reservasi & harga",
    descEn: "Manage rooms, reservations, and pricing",
    allowedRoles: ["ACCOMMODATION"],
    accentClass: "border-blue-500/60 bg-blue-50",
  },
  {
    id: "sme",
    icon: "🏪",
    labelId: "Pemilik UMKM",
    labelEn: "SME/UMKM Owner",
    descId: "Kelola kuliner, suvenir, produk & penjualan",
    descEn: "Manage culinary, souvenirs, products, and sales",
    allowedRoles: ["UMKM"],
    accentClass: "border-amber-500/60 bg-amber-50",
  },
  {
    id: "experience",
    icon: "🎭",
    labelId: "Penyelenggara Event",
    labelEn: "Experience Organizer",
    descId: "Kelola event, acara & pengalaman wisata",
    descEn: "Manage events, activities, and experiences",
    allowedRoles: ["EVENT_ORGANIZER"],
    accentClass: "border-purple-500/60 bg-purple-50",
  },
  {
    id: "transport",
    icon: "🚗",
    labelId: "Penyedia Transportasi",
    labelEn: "Transport Provider",
    descId: "Kelola armada, supir & pemesanan",
    descEn: "Manage fleet, drivers, and bookings",
    allowedRoles: ["TRANSPORT"],
    accentClass: "border-sky-500/60 bg-sky-50",
  },
];

function isRoleChoiceAllowed(choice: LoginRoleChoice, role: PartnerRole) {
  const selected = ROLE_CHOICES.find((item) => item.id === choice);
  if (!selected) return false;
  return selected.allowedRoles.includes(role);
}

export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isId = locale === "id";
  const { login, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRoleChoice, setSelectedRoleChoice] = useState<LoginRoleChoice | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");

    if (!selectedRoleChoice) {
      setError(isId ? "Pilih peran terlebih dahulu." : "Please choose a role first.");
      setStep("role");
      return;
    }

    const success = await login(data.email, data.password);
    if (success) {
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        if (!isRoleChoiceAllowed(selectedRoleChoice, authStore.user.role)) {
          logout();
          setError(
            isId
              ? "Akun ini tidak sesuai dengan peran yang dipilih. Silakan pilih peran yang benar."
              : "This account does not match the selected role. Please choose the correct role."
          );
          setStep("role");
          return;
        }

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

  const selectedRole = selectedRoleChoice
    ? ROLE_CHOICES.find((item) => item.id === selectedRoleChoice) ?? null
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {step === "role" ? (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-on-surface/60">
            {isId ? "Pilih Peran" : "Choose Role"}
          </div>

          {ROLE_CHOICES.map((item) => {
            const active = selectedRoleChoice === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedRoleChoice(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  active ? item.accentClass : "border-surface-container-high bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">{item.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-on-surface">
                      {isId ? item.labelId : item.labelEn}
                    </p>
                    <p className="truncate text-xs text-on-surface/60">
                      {isId ? item.descId : item.descEn}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={!selectedRoleChoice}
            onClick={() => setStep("form")}
          >
            {isId ? "Lanjut" : "Continue"}
          </Button>
        </div>
      ) : (
        <>
          {selectedRole ? (
            <div className="rounded-xl border border-surface-container-high bg-surface p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-lg">{selectedRole.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-on-surface">
                      {isId ? selectedRole.labelId : selectedRole.labelEn}
                    </p>
                    <p className="truncate text-xs text-on-surface/60">
                      {isId ? "Konteks login aktif" : "Active login context"}
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setStep("role")}>
                  {isId ? "Ganti" : "Change"}
                </Button>
              </div>
            </div>
          ) : null}

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
                className="absolute right-3 top-2.5 text-on-surface/40 hover:text-on-surface/70"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep("role")}>
              {isId ? "Kembali" : "Back"}
            </Button>
            <button
              type="button"
              onClick={() => alert(t("forgotPasswordNotAvailable"))}
              className="font-medium text-primary hover:text-primary"
            >
              {t("forgotPassword")}
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            <LogIn className="h-4 w-4" />
            {t("login")}
          </Button>
        </>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-on-surface/60">
        {t("noAccount")} {" "}
        <Link href="/register" className="font-medium text-primary hover:text-primary">
          {t("registerHere")}
        </Link>
      </p>
    </form>
  );
}
