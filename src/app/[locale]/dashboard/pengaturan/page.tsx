"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { User, Lock, Bell, Globe, Shield, Save } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "security", label: "Keamanan", icon: Lock },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "language", label: "Bahasa", icon: Globe },
  { id: "privacy", label: "Privasi", icon: Shield },
];

export default function PengaturanPage() {
  const t = useTranslations();
  const { user } = useAuthStore();
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

  const [notifications, setNotifications] = useState({
    newReservation: true,
    newReview: true,
    lowStock: true,
    approvalUpdate: true,
    systemUpdate: false,
    emailDigest: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("dashboard.settings")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">Kelola akun dan preferensi Anda</p>
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
                  {tab.label}
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
                <CardTitle>Informasi Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar name={user?.fullName ?? "User"} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">{user?.fullName}</p>
                    <p className="text-xs text-stone-500">{user?.role}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">Ganti Foto</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Nama Lengkap</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nomor Telepon</Label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nama Organisasi</Label>
                    <Input
                      value={profileForm.organizationName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, organizationName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Alamat</Label>
                  <Input
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? "Tersimpan!" : "Simpan Perubahan"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Password Saat Ini</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>Password Baru</Label>
                  <Input type="password" placeholder="Min. 8 karakter" />
                </div>
                <div className="space-y-1.5">
                  <Label>Konfirmasi Password Baru</Label>
                  <Input type="password" placeholder="Ulangi password baru" />
                </div>
                <Button onClick={handleSave}>
                  <Lock className="h-4 w-4" />
                  {saved ? "Tersimpan!" : "Ubah Password"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "newReservation", label: "Reservasi baru", desc: "Notifikasi ketika ada reservasi masuk" },
                  { key: "newReview", label: "Ulasan baru", desc: "Notifikasi ketika pengunjung menulis ulasan" },
                  { key: "lowStock", label: "Stok menipis", desc: "Notifikasi ketika produk hampir habis" },
                  { key: "approvalUpdate", label: "Update persetujuan", desc: "Notifikasi status pendaftaran mitra" },
                  { key: "systemUpdate", label: "Update sistem", desc: "Informasi pembaruan platform" },
                  { key: "emailDigest", label: "Ringkasan email mingguan", desc: "Laporan singkat aktivitas mingguan" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-stone-50">
                    <div>
                      <p className="text-sm font-medium text-stone-800">{label}</p>
                      <p className="text-xs text-stone-400">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${notifications[key as keyof typeof notifications] ? "bg-emerald-500" : "bg-stone-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[key as keyof typeof notifications] ? "translate-x-4" : ""}`} />
                    </button>
                  </div>
                ))}
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? "Tersimpan!" : "Simpan Preferensi"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "language" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Bahasa</CardTitle>
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
                      {lang.code === "id" && <p className="text-xs text-emerald-600">Aktif</p>}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Privasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <p className="text-sm font-medium text-stone-800 mb-1">Data Akun</p>
                  <p className="text-xs text-stone-500 mb-3">Kelola data pribadi dan akun Anda di platform.</p>
                  <Button variant="outline" size="sm">Unduh Data Saya</Button>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm font-semibold text-red-800 mb-1">Hapus Akun</p>
                  <p className="text-xs text-red-600 mb-3">Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.</p>
                  <Button variant="destructive" size="sm">Hapus Akun</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
