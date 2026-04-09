"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { APPROVAL_STATUS_COLORS } from "@/lib/constants";

const APPROVALS = [
  {
    id: "1",
    orgName: "Homestay Bunga Desa",
    role: "penginapan",
    owner: "Hendra Kusuma",
    email: "hendra@example.com",
    phone: "0812-3456-7890",
    address: "Jl. Raya Desa No. 12, Desa Sukamaju",
    submittedAt: "2025-04-05",
    status: "pending",
    description: "Homestay dengan 4 kamar menghadap sawah, sarapan tersedia.",
  },
  {
    id: "2",
    orgName: "Warung Kopi Mbah Djoko",
    role: "umkm",
    owner: "Djoko Susanto",
    email: "djoko@example.com",
    phone: "0813-9876-5432",
    address: "Pasar Desa Sukamaju Blok B-05",
    submittedAt: "2025-04-04",
    status: "pending",
    description: "Penjual kopi robusta lokal dan camilan tradisional.",
  },
  {
    id: "3",
    orgName: "Komunitas Seni Cakra",
    role: "event_organizer",
    owner: "Rina Permata",
    email: "rina@example.com",
    phone: "0811-2233-4455",
    address: "Sanggar Seni Desa Sukamaju",
    submittedAt: "2025-04-03",
    status: "approved",
    description: "Komunitas seni yang mengadakan pertunjukan budaya dan workshop.",
  },
];

const roleLabels: Record<string, string> = {
  penginapan: "Penginapan",
  umkm: "UMKM",
  event_organizer: "Event Organizer",
};

export default function ApprovalPage() {
  const t = useTranslations();
  const [approvals, setApprovals] = useState(APPROVALS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pending = approvals.filter((a) => a.status === "pending");
  const approved = approvals.filter((a) => a.status === "approved");
  const rejected = approvals.filter((a) => a.status === "rejected");

  const handleApprove = (id: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)));
    setSelectedId(null);
  };

  const handleReject = (id: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)));
    setSelectedId(null);
  };

  const selected = approvals.find((a) => a.id === selectedId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("approval.title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">Kelola pendaftaran mitra baru desa wisata</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
          <Clock className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-amber-700">{pending.length}</p>
          <p className="text-xs text-amber-600">Menunggu</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-700">{approved.length}</p>
          <p className="text-xs text-emerald-600">Disetujui</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
          <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-700">{rejected.length}</p>
          <p className="text-xs text-red-600">Ditolak</p>
        </div>
      </div>

      <div className={`grid gap-6 ${selected ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Approval List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengajuan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvals.map((a) => {
              const statusKey = a.status as keyof typeof APPROVAL_STATUS_COLORS;
              return (
                <div
                  key={a.id}
                  className={`rounded-xl border p-3 transition-all cursor-pointer ${
                    selectedId === a.id
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-stone-100 bg-stone-50 hover:border-stone-300"
                  }`}
                  onClick={() => setSelectedId(selectedId === a.id ? null : a.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{a.orgName}</p>
                      <p className="text-xs text-stone-500">{roleLabels[a.role]} · {a.owner}</p>
                      <p className="text-xs text-stone-400 mt-0.5">Diajukan {a.submittedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${APPROVAL_STATUS_COLORS[statusKey]}`}>
                        {a.status === "pending" ? "Menunggu" : a.status === "approved" ? "Disetujui" : "Ditolak"}
                      </span>
                      <Eye className="h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Detail Panel */}
        {selected && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Detail Pengajuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-stone-500">Nama Organisasi</p>
                  <p className="text-sm font-semibold text-stone-900">{selected.orgName}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Jenis Mitra</p>
                  <p className="text-sm text-stone-800">{roleLabels[selected.role]}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Pemilik</p>
                  <p className="text-sm text-stone-800">{selected.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Kontak</p>
                  <p className="text-sm text-stone-800">{selected.email}</p>
                  <p className="text-sm text-stone-800">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Alamat</p>
                  <p className="text-sm text-stone-800">{selected.address}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Deskripsi</p>
                  <p className="text-sm text-stone-800">{selected.description}</p>
                </div>
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2 border-t border-stone-100">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(selected.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {t("approval.approve")}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(selected.id)}
                  >
                    <XCircle className="h-4 w-4" />
                    {t("approval.reject")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
