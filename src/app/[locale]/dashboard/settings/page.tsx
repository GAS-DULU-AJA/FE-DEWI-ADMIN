"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import { User, Lock, Bell, Globe, Shield, Save, Building2, Users, CheckCircle2 } from "lucide-react";
import type { OrgAdminRole } from "@/types";

const TABS = [
  { id: "profile", icon: User },
  { id: "security", icon: Lock },
  { id: "notifications", icon: Bell },
  { id: "organization", icon: Building2 },
  { id: "adminManagement", icon: Users },
  { id: "language", icon: Globe },
  { id: "privacy", icon: Shield },
];

const ROLE_BADGE_CLASS: Record<OrgAdminRole, string> = {
  owner: "bg-amber-100 text-amber-700",
  admin: "bg-sky-100 text-sky-700",
  viewer: "bg-stone-200 text-stone-700",
};

const NOTIFICATION_ROLE_ORDER = ["ALL", "VILLAGE_ADMIN", "ACCOMMODATION", "UMKM", "EVENT_ORGANIZER"] as const;

type AdminMember = {
  id: string;
  email: string;
  role: OrgAdminRole;
  status: "active" | "invited" | "deactivated";
};

const formatPreferenceLabel = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatRoleLabel = (value: string) => {
  if (value === "ALL") return "All Roles";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function PengaturanPage() {
  const t = useTranslations();
  const tv = useTranslations("village");
  const ts = useTranslations("settingsPage");
  const { user } = useAuthStore();
  const { preferences, setPreference } = useNotificationStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: "0812-3456-7890",
    address: "Jl. Raya Desa Sukamaju No. 12",
    organizationName: user?.organizationName ?? "",
    bio: "Pengelola penginapan desa wisata dengan pengalaman 5 tahun.",
  });

  const [orgForm, setOrgForm] = useState({
    displayName: user?.organizationName ?? "",
    description: ts("organization.defaultDescription"),
    website: "https://mitradesa.id",
    instagram: "@mitradesa",
    tiktok: "@mitradesa",
  });

  const [orgAdmins, setOrgAdmins] = useState<AdminMember[]>([
    { id: "admin-1", email: user?.email ?? "owner@mitradesa.id", role: "owner", status: "active" },
    { id: "admin-2", email: "ops@mitradesa.id", role: "admin", status: "active" },
    { id: "admin-3", email: "finance@mitradesa.id", role: "viewer", status: "invited" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgAdminRole>("viewer");

  const [bankForm, setBankForm] = useState({
    accountHolder: user?.fullName ?? "",
    bankName: "BCA",
    accountNumber: "1234567890",
    branch: "Cabang Utama",
  });

  const [withdrawAmount, setWithdrawAmount] = useState("500000");
  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: "wd-001", amount: 750000, status: "settled", requestedAt: "2026-04-03" },
    { id: "wd-002", amount: 500000, status: "pending", requestedAt: "2026-04-10" },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleWithdrawRequest = () => {
    const amount = Number(withdrawAmount || 0);
    if (amount <= 0) return;
    setWithdrawRequests((prev) => [
      {
        id: `wd-${Date.now()}`,
        amount,
        status: "pending",
        requestedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setWithdrawAmount("");
  };

  const handleInviteAdmin = () => {
    if (!inviteEmail.trim()) return;
    setOrgAdmins((prev) => [
      {
        id: `admin-${Date.now()}`,
        email: inviteEmail.trim(),
        role: inviteRole,
        status: "invited",
      },
      ...prev,
    ]);
    setInviteEmail("");
    setInviteRole("viewer");
  };

  const handleDeactivateAdmin = (id: string) => {
    setOrgAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id ? { ...admin, status: admin.status === "deactivated" ? "active" : "deactivated" } : admin,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("dashboard.settings")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">{ts("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-4 pb-4 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {ts(`tabs.${tab.id}`)}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("profile.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar name={user?.fullName ?? "User"} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">{user?.fullName}</p>
                    <p className="text-xs text-stone-500">{user?.role}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">{ts("profile.changePhoto")}</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{ts("profile.fullName")}</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{ts("profile.email")}</Label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{ts("profile.phone")}</Label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{ts("profile.organization")}</Label>
                    <Input
                      value={profileForm.organizationName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, organizationName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{ts("profile.address")}</Label>
                  <Input
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{ts("profile.bio")}</Label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? ts("saved") : ts("profile.save")}
                </Button>

                {user?.role === "VILLAGE_ADMIN" ? (
                  <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{tv("settings.adminManagement")}</p>
                      <p className="text-xs text-stone-500">{tv("settings.adminManagementDesc")}</p>
                    </div>
                    <div className="space-y-2">
                      {[user?.email, "coadmin@sarialam.id"].map((email) => (
                        <div key={email} className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-3 py-2">
                          <span className="text-sm text-stone-700">{email}</span>
                          <Button variant="outline" size="sm">Remove</Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder={tv("settings.newAdminEmailPlaceholder")} />
                      <Button variant="outline">{tv("settings.addAdmin")}</Button>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-stone-900">{tv("settings.villageNotificationRules")}</p>
                      <p className="text-xs text-stone-500">{tv("settings.villageNotificationRulesDesc")}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {[
                        tv("settings.notifyPartnerApplications"),
                        tv("settings.notifyExternalCoordination"),
                        tv("settings.notifyNegativeReviews"),
                        tv("settings.notifySettlementDelays"),
                      ].map((label) => (
                        <label key={label} className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700">
                          <input type="checkbox" defaultChecked />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}

                {user?.role === "EVENT_ORGANIZER" ? (
                  <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{ts("organizer.bankSetupTitle")}</p>
                      <p className="text-xs text-stone-500">{ts("organizer.bankSetupSubtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>{ts("organizer.accountHolder")}</Label>
                        <Input
                          value={bankForm.accountHolder}
                          onChange={(e) => setBankForm((p) => ({ ...p, accountHolder: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{ts("organizer.bankName")}</Label>
                        <Input
                          value={bankForm.bankName}
                          onChange={(e) => setBankForm((p) => ({ ...p, bankName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{ts("organizer.accountNumber")}</Label>
                        <Input
                          value={bankForm.accountNumber}
                          onChange={(e) => setBankForm((p) => ({ ...p, accountNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{ts("organizer.branch")}</Label>
                        <Input
                          value={bankForm.branch}
                          onChange={(e) => setBankForm((p) => ({ ...p, branch: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" onClick={handleSave}>{ts("organizer.saveBankAccount")}</Button>
                    </div>

                    <div className="border-t border-stone-200 pt-4">
                      <p className="text-sm font-semibold text-stone-900">{ts("organizer.withdrawRequest")}</p>
                      <p className="mb-2 text-xs text-stone-500">{ts("organizer.withdrawHint")}</p>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min={100000}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder={ts("organizer.withdrawAmountPlaceholder")}
                        />
                        <Button onClick={handleWithdrawRequest}>{ts("organizer.request")}</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{ts("organizer.withdrawHistory")}</p>
                      {withdrawRequests.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-3 py-2">
                          <div>
                            <p className="text-sm font-medium text-stone-800">{item.id}</p>
                            <p className="text-xs text-stone-500">{item.requestedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-stone-900">{t("common.price")} {item.amount.toLocaleString("id-ID")}</p>
                            <Badge className={item.status === "settled" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                              {ts(`withdraw.status.${item.status}`)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("security.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{ts("security.currentPassword")}</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>{ts("security.newPassword")}</Label>
                  <Input type="password" placeholder={ts("security.newPasswordPlaceholder")} />
                </div>
                <div className="space-y-1.5">
                  <Label>{ts("security.confirmPassword")}</Label>
                  <Input type="password" placeholder={ts("security.confirmPasswordPlaceholder")} />
                </div>
                <Button onClick={handleSave}>
                  <Lock className="h-4 w-4" />
                  {saved ? ts("saved") : ts("security.save")}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("notifications.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {NOTIFICATION_ROLE_ORDER.map((role) => {
                  const rolePreferences = preferences.filter((item) =>
                    role === "ALL" ? item.roles.length > 1 : item.roles.includes(role),
                  );
                  if (rolePreferences.length === 0) return null;

                  return (
                    <div key={role} className="rounded-xl border border-stone-200 p-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">{formatRoleLabel(role)}</p>
                      <div className="space-y-2">
                        {rolePreferences.map((item) => (
                          <div key={item.type} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-stone-800">{formatPreferenceLabel(item.type)}</p>
                              <p className="text-xs text-stone-400">{ts("notifications.fromSharedConfig")}</p>
                            </div>
                            <button
                              onClick={() => setPreference(item.type, !item.enabled)}
                              className={`relative h-5 w-9 rounded-full transition-colors ${item.enabled ? "bg-emerald-500" : "bg-stone-300"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${item.enabled ? "translate-x-4" : ""}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? ts("saved") : ts("notifications.save")}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "organization" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("organization.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <Avatar name={orgForm.displayName || "Organization"} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{orgForm.displayName || ts("organization.logoFallback")}</p>
                    <p className="text-xs text-stone-500">{ts("organization.logoHint")}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">{ts("organization.uploadLogo")}</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{ts("organization.displayName")}</Label>
                    <Input
                      value={orgForm.displayName}
                      onChange={(e) => setOrgForm((prev) => ({ ...prev, displayName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{ts("organization.website")}</Label>
                    <Input
                      value={orgForm.website}
                      onChange={(e) => setOrgForm((prev) => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>{ts("organization.description")}</Label>
                  <Textarea
                    rows={4}
                    value={orgForm.description}
                    onChange={(e) => setOrgForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{ts("organization.instagram")}</Label>
                    <Input
                      value={orgForm.instagram}
                      onChange={(e) => setOrgForm((prev) => ({ ...prev, instagram: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{ts("organization.tiktok")}</Label>
                    <Input
                      value={orgForm.tiktok}
                      onChange={(e) => setOrgForm((prev) => ({ ...prev, tiktok: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? ts("saved") : ts("organization.save")}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "adminManagement" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("adminManagement.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-stone-800">{ts("adminManagement.currentAdmins")}</p>
                  {orgAdmins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        {admin.status === "active" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        <div>
                          <p className="text-sm font-medium text-stone-800">{admin.email}</p>
                          <p className="text-xs text-stone-500">{ts(`adminManagement.status.${admin.status}`)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={ROLE_BADGE_CLASS[admin.role]}>{ts(`adminManagement.roles.${admin.role}`)}</Badge>
                        {admin.role !== "owner" && (
                          <Button variant="outline" size="sm" onClick={() => handleDeactivateAdmin(admin.id)}>
                            {admin.status === "deactivated" ? ts("adminManagement.activate") : ts("adminManagement.deactivate")}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
                  <p className="text-sm font-medium text-stone-800">{ts("adminManagement.inviteTitle")}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input
                      className="sm:col-span-2"
                      type="email"
                      value={inviteEmail}
                      placeholder={ts("adminManagement.emailPlaceholder")}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as OrgAdminRole)}
                      className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
                    >
                      <option value="admin">{ts("adminManagement.roles.admin")}</option>
                      <option value="viewer">{ts("adminManagement.roles.viewer")}</option>
                    </select>
                  </div>
                  <Button onClick={handleInviteAdmin}>{ts("adminManagement.sendInvite")}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "language" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("language.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
                  { code: "en", label: "English", flag: "🇬🇧" },
                  { code: "ja", label: "日本語", flag: "🇯🇵" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      lang.code === "id"
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-stone-800">{lang.label}</p>
                      {lang.code === "id" && <p className="text-xs text-emerald-600">{ts("language.active")}</p>}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>{ts("privacy.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <p className="text-sm font-medium text-stone-800 mb-1">{ts("privacy.accountDataTitle")}</p>
                  <p className="text-xs text-stone-500 mb-3">{ts("privacy.accountDataDesc")}</p>
                  <Button variant="outline" size="sm">{ts("privacy.downloadMyData")}</Button>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm font-semibold text-red-800 mb-1">{ts("privacy.deleteAccountTitle")}</p>
                  <p className="text-xs text-red-600 mb-3">{ts("privacy.deleteAccountDesc")}</p>
                  <Button variant="destructive" size="sm">{ts("privacy.deleteAccount")}</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
