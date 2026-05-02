"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  MapPin,
  Image as ImageIcon,
  Wrench,
  FileText,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  Send,
} from "lucide-react";
import { SubmissionDisclaimer } from "./submission-disclaimer";

const LocationPicker = dynamic(
  () => import("./location-picker").then((module) => module.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-surface-container-high bg-surface-container-low p-4 text-sm text-on-surface/60">
        Memuat peta...
      </div>
    ),
  }
);

// ── Facilities data ──────────────────────────────────────────────────────────

const FACILITY_GROUPS: { category: string; label: string; items: string[] }[] = [
  {
    category: "general",
    label: "Umum",
    items: ["WiFi Gratis", "Parkir", "Resepsionis 24 Jam", "AC Lobi", "CCTV", "Elevator"],
  },
  {
    category: "room",
    label: "Kamar",
    items: ["AC Kamar", "TV", "Kamar Mandi Dalam", "Air Panas", "Mini Bar", "Kulkas", "Brankas"],
  },
  {
    category: "dining",
    label: "Makan & Minum",
    items: ["Sarapan Termasuk", "Restoran", "Dapur Bersama", "Room Service"],
  },
  {
    category: "recreation",
    label: "Rekreasi",
    items: ["Kolam Renang", "Taman", "Area Bermain Anak", "Gym / Pusat Kebugaran"],
  },
  {
    category: "service",
    label: "Layanan",
    items: ["Laundry", "Antar-Jemput Bandara", "Tour Guide", "Penitipan Barang"],
  },
  {
    category: "accessibility",
    label: "Aksesibilitas",
    items: ["Ramp Kursi Roda", "Kamar Disabilitas", "Parkir Disabilitas"],
  },
];

const DOCUMENT_TYPES = [
  { id: "nib", label: "NIB / SIUP (Izin Usaha)", required: true },
  { id: "tdup", label: "TDUP (Tanda Daftar Usaha Pariwisata)", required: true },
  { id: "npwp", label: "NPWP", required: true },
  { id: "imb", label: "IMB / PBG (Izin Bangunan)", required: false },
  { id: "hygiene", label: "Sertifikat Laik Hygiene Sanitasi", required: false },
  { id: "fire", label: "Sertifikat Keselamatan Kebakaran", required: false },
];

const ACCOMMODATION_CATEGORIES = [
  { value: "homestay", label: "Homestay" },
  { value: "villa", label: "Villa" },
  { value: "guest_house", label: "Guest House" },
  { value: "resort", label: "Resort" },
  { value: "glamping", label: "Glamping" },
  { value: "other", label: "Lainnya" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  // Step 2
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  // Step 3: photos tracked separately
  photoCount: number;
  // Step 4
  facilities: string[];
  // Step 5: documents tracked separately
  documents: Record<string, boolean>;
  // Step 6
  priceMin: string;
  priceMax: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  // Step 7
  agreeTerms: boolean;
}

const initialFormData: FormData = {
  name: "",
  category: "homestay",
  shortDescription: "",
  description: "",
  address: "",
  village: "",
  district: "",
  regency: "",
  province: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  photoCount: 0,
  facilities: [],
  documents: {},
  priceMin: "",
  priceMax: "",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  cancellationPolicy: "",
  agreeTerms: false,
};

// ── Step definitions ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Informasi Dasar", icon: Building2 },
  { id: 2, label: "Lokasi", icon: MapPin },
  { id: 3, label: "Foto", icon: ImageIcon },
  { id: 4, label: "Fasilitas", icon: Wrench },
  { id: 5, label: "Dokumen", icon: FileText },
  { id: 6, label: "Harga & Kebijakan", icon: DollarSign },
  { id: 7, label: "Review & Kirim", icon: Eye },
];

// ── Validation helpers ────────────────────────────────────────────────────────

function validateStep(step: number, data: FormData): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!data.name.trim()) errors.push("Nama penginapan wajib diisi.");
    if (!data.category) errors.push("Kategori wajib dipilih.");
    if (data.shortDescription.length > 200) errors.push("Deskripsi singkat maksimal 200 karakter.");
    if (data.description.trim().length > 0 && data.description.trim().length < 100)
      errors.push("Deskripsi lengkap minimal 100 karakter.");
  }
  if (step === 2) {
    if (!data.address.trim()) errors.push("Alamat wajib diisi.");
    if (!data.village.trim()) errors.push("Desa/Kelurahan wajib diisi.");
    if (!data.regency.trim()) errors.push("Kabupaten/Kota wajib diisi.");
  }
  if (step === 3) {
    if (data.photoCount < 5) errors.push("Upload minimal 5 foto penginapan.");
  }
  if (step === 6) {
    const min = Number(data.priceMin);
    const max = Number(data.priceMax);
    if (!data.priceMin) errors.push("Harga minimum wajib diisi.");
    if (!data.priceMax) errors.push("Harga maksimum wajib diisi.");
    if (min > 0 && max > 0 && max < min) errors.push("Harga maksimum harus ≥ harga minimum.");
  }
  if (step === 7) {
    if (!data.agreeTerms) errors.push("Anda harus menyetujui syarat & ketentuan.");
  }
  return errors;
}

// ── Step components ────────────────────────────────────────────────────────────

function StepBasicInfo({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nama Penginapan <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Contoh: Homestay Bukit Hijau"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">
          Kategori <span className="text-red-500">*</span>
        </Label>
        <select
          id="category"
          value={data.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm"
        >
          {ACCOMMODATION_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="shortDescription">
          Deskripsi Singkat{" "}
          <span className="text-on-surface/40 text-xs">({data.shortDescription.length}/200 karakter)</span>
        </Label>
        <Input
          id="shortDescription"
          value={data.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          placeholder="Ringkasan menarik untuk kartu properti"
          maxLength={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          Deskripsi Lengkap{" "}
          <span className="text-on-surface/40 text-xs">
            ({data.description.length} karakter, min. 100)
          </span>
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Jelaskan fasilitas, lokasi unik, pengalaman yang ditawarkan, dan keistimewaan penginapan Anda secara lengkap."
          rows={5}
        />
      </div>
    </div>
  );
}

function StepLocation({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  const handleMapLocationChange = useCallback(
    (latitude: string, longitude: string) => {
      onChange({ latitude, longitude });
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">
          Alamat Lengkap <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Jl. Raya Desa No. 5, Dusun Wetan"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="village">
            Desa / Kelurahan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="village"
            value={data.village}
            onChange={(e) => onChange({ village: e.target.value })}
            placeholder="Desa Wisata Nglanggeran"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">Kecamatan</Label>
          <Input
            id="district"
            value={data.district}
            onChange={(e) => onChange({ district: e.target.value })}
            placeholder="Patuk"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="regency">
            Kabupaten / Kota <span className="text-red-500">*</span>
          </Label>
          <Input
            id="regency"
            value={data.regency}
            onChange={(e) => onChange({ regency: e.target.value })}
            placeholder="Gunungkidul"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">Provinsi</Label>
          <Input
            id="province"
            value={data.province}
            onChange={(e) => onChange({ province: e.target.value })}
            placeholder="Daerah Istimewa Yogyakarta"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Kode Pos</Label>
          <Input
            id="postalCode"
            value={data.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            placeholder="55872"
            maxLength={5}
          />
        </div>
      </div>
      <div className="space-y-3 rounded-lg border border-surface-container-high bg-surface-container-low p-4">
        <p className="text-sm font-medium text-on-surface/80">Tag Lokasi GPS Presisi</p>
        <LocationPicker
          latitude={data.latitude}
          longitude={data.longitude}
          onLocationChange={handleMapLocationChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={data.latitude}
              onChange={(e) => onChange({ latitude: e.target.value })}
              placeholder="-7.8120"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={data.longitude}
              onChange={(e) => onChange({ longitude: e.target.value })}
              placeholder="110.5270"
            />
          </div>
        </div>
        <p className="text-xs text-on-surface/60">
          Koordinat dapat dipilih dari pencarian peta atau klik langsung pada peta. Admin akan
          memverifikasi ketepatan lokasi terhadap alamat yang diajukan.
        </p>
      </div>
    </div>
  );
}

function StepPhotos({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-6 text-center">
        <ImageIcon className="mx-auto h-10 w-10 text-on-surface/40" />
        <p className="mt-2 text-sm font-medium text-on-surface/80">Upload Foto Penginapan</p>
        <p className="mt-1 text-xs text-on-surface/60">Minimal 5 foto, maksimal 20 foto. JPEG, PNG, WebP, maks. 5 MB per foto.</p>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="mt-4 block w-full text-sm text-on-surface/70 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/10"
          onChange={(e) => onChange({ photoCount: e.target.files?.length ?? 0 })}
        />
        {data.photoCount > 0 && (
          <p className="mt-2 text-sm font-medium text-primary">
            {data.photoCount} foto dipilih{" "}
            {data.photoCount < 5 && (
              <span className="text-amber-600">(perlu {5 - data.photoCount} foto lagi)</span>
            )}
          </p>
        )}
      </div>
      <div className="space-y-2 rounded-lg border border-surface-container-high p-4">
        <p className="text-sm font-medium text-on-surface/80">Standar Kualitas Foto</p>
        <table className="w-full text-xs text-on-surface/70">
          <tbody className="divide-y divide-surface-container">
            {[
              ["Resolusi minimal", "1280 × 720 px (HD)"],
              ["Format", "JPEG, PNG, WebP"],
              ["Ukuran maksimal", "5 MB per foto"],
              ["Kategori wajib", "Eksterior, Interior, Kamar"],
              ["Watermark", "Tidak diperbolehkan"],
            ].map(([k, v]) => (
              <tr key={k} className="flex items-center gap-2 py-1">
                <td className="w-36 font-medium">{k}</td>
                <td className="text-on-surface/60">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StepFacilities({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  const toggle = useCallback(
    (item: string) => {
      const next = data.facilities.includes(item)
        ? data.facilities.filter((f) => f !== item)
        : [...data.facilities, item];
      onChange({ facilities: next });
    },
    [data.facilities, onChange]
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-on-surface/60">
        Pilih semua fasilitas yang tersedia di penginapan Anda. Dipilih:{" "}
        <strong>{data.facilities.length}</strong> fasilitas.
      </p>
      {FACILITY_GROUPS.map((group) => (
        <div key={group.category}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface/40">
            {group.label}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.items.map((item) => {
              const selected = data.facilities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                    selected
                      ? "border-primary/400 bg-primary/10 text-primary"
                      : "border-surface-container-high bg-surface-container-lowest text-on-surface/70 hover:border-surface-container-high"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                      selected ? "border-primary/500 bg-primary/100" : "border-surface-container-high"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </span>
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepDocuments({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-on-surface/60">
        Upload dokumen legal penginapan. Dokumen bertanda{" "}
        <span className="text-red-500">*</span> wajib dilampirkan.
      </p>
      {DOCUMENT_TYPES.map((doc) => (
        <div key={doc.id} className="rounded-lg border border-surface-container-high p-4">
          <Label className="mb-2 block">
            {doc.label} {doc.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,image/*"
              className="block flex-1 text-sm text-on-surface/70 file:mr-3 file:rounded-lg file:border-0 file:bg-surface-container-low file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-on-surface/80 hover:file:bg-surface-container"
              onChange={(e) => {
                const hasFile = (e.target.files?.length ?? 0) > 0;
                onChange({ documents: { ...data.documents, [doc.id]: hasFile } });
              }}
            />
            {data.documents[doc.id] && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <Check className="h-3 w-3" /> Dipilih
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-on-surface/40">PDF atau gambar, maks. 10 MB</p>
        </div>
      ))}
    </div>
  );
}

function StepPricing({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priceMin">
            Harga Minimum / Malam (IDR) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="priceMin"
            type="number"
            min={0}
            value={data.priceMin}
            onChange={(e) => onChange({ priceMin: e.target.value })}
            placeholder="300000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceMax">
            Harga Maksimum / Malam (IDR) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="priceMax"
            type="number"
            min={0}
            value={data.priceMax}
            onChange={(e) => onChange({ priceMax: e.target.value })}
            placeholder="850000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="checkIn">Jam Check-In</Label>
          <Input
            id="checkIn"
            type="time"
            value={data.checkInTime}
            onChange={(e) => onChange({ checkInTime: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkOut">Jam Check-Out</Label>
          <Input
            id="checkOut"
            type="time"
            value={data.checkOutTime}
            onChange={(e) => onChange({ checkOutTime: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cancellation">Kebijakan Pembatalan</Label>
        <Textarea
          id="cancellation"
          value={data.cancellationPolicy}
          onChange={(e) => onChange({ cancellationPolicy: e.target.value })}
          placeholder="Contoh: Refund 100% jika dibatalkan ≥ 7 hari sebelum check-in. Refund 50% untuk 3–6 hari. Tidak ada refund jika < 3 hari."
          rows={3}
        />
      </div>
    </div>
  );
}

function StepReview({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const categoryLabel =
    ACCOMMODATION_CATEGORIES.find((c) => c.value === data.category)?.label ?? data.category;

  const requiredDocsFilled = DOCUMENT_TYPES.filter((d) => d.required).every(
    (d) => data.documents[d.id]
  );

  const summaryRows: { label: string; value: string; ok: boolean }[] = [
    {
      label: "Nama & Kategori",
      value: `${data.name} (${categoryLabel})`,
      ok: !!data.name,
    },
    {
      label: "Deskripsi",
      value:
        data.description.length >= 100
          ? `${data.description.length} karakter`
          : "Terlalu pendek (<100 karakter)",
      ok: data.description.length >= 100,
    },
    {
      label: "Lokasi",
      value:
        data.address && data.village && data.regency
          ? `${data.address}, ${data.village}, ${data.regency}`
          : "Belum lengkap",
      ok: !!(data.address && data.village && data.regency),
    },
    {
      label: "Foto",
      value: `${data.photoCount} foto dipilih`,
      ok: data.photoCount >= 5,
    },
    {
      label: "Fasilitas",
      value: `${data.facilities.length} fasilitas dipilih`,
      ok: data.facilities.length > 0,
    },
    {
      label: "Dokumen Wajib",
      value: requiredDocsFilled ? "Semua diunggah" : "Ada dokumen wajib yang belum diisi",
      ok: requiredDocsFilled,
    },
    {
      label: "Harga per Malam",
      value:
        data.priceMin && data.priceMax
          ? `Rp ${Number(data.priceMin).toLocaleString("id-ID")} – Rp ${Number(data.priceMax).toLocaleString("id-ID")}`
          : "Belum diisi",
      ok: !!(data.priceMin && data.priceMax),
    },
    {
      label: "Check-In / Check-Out",
      value: `${data.checkInTime} / ${data.checkOutTime}`,
      ok: !!(data.checkInTime && data.checkOutTime),
    },
  ];

  return (
    <div className="space-y-6">
      <SubmissionDisclaimer />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ringkasan Pengajuan</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-surface-container">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex items-start gap-3 py-2.5">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  row.ok ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-600"
                }`}
              >
                {row.ok ? <Check className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
              </span>
              <div className="flex-1">
                <p className="text-xs font-medium text-on-surface/70">{row.label}</p>
                <p className={`text-sm ${row.ok ? "text-on-surface" : "text-amber-700"}`}>{row.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-container-high p-4 hover:bg-surface-container-low">
        <input
          type="checkbox"
          checked={data.agreeTerms}
          onChange={(e) => onChange({ agreeTerms: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-sm text-on-surface/80">
          Saya menyatakan bahwa seluruh informasi yang diberikan adalah benar dan akurat. Saya
          memahami bahwa pengajuan akan melalui proses verifikasi dan platform berhak menolak
          pengajuan yang tidak memenuhi standar.
        </span>
      </label>
    </div>
  );
}

// ── Main wizard component ─────────────────────────────────────────────────────

export function AccommodationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const onChange = useCallback((patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setErrors([]);
  }, []);

  const goNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors([]);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goPrev = () => {
    setErrors([]);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleDraft = () => {
    setIsDraft(true);
    setSubmitted(true);
  };

  const handleSubmit = () => {
    const lastErrors = validateStep(7, formData);
    if (lastErrors.length > 0) {
      setErrors(lastErrors);
      return;
    }
    setIsDraft(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isDraft ? "bg-surface-container" : "bg-primary/10"
            }`}
          >
            {isDraft ? (
              <FileText className={`h-8 w-8 text-on-surface/60`} />
            ) : (
              <Send className="h-8 w-8 text-primary" />
            )}
          </div>
          <h2 className="text-xl font-bold text-on-surface">
            {isDraft ? "Draft Tersimpan!" : "Pengajuan Berhasil Dikirim!"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-on-surface/60">
            {isDraft
              ? "Data telah disimpan sebagai draft. Anda dapat melanjutkan pengajuan kapan saja."
              : "Pengajuan penginapan Anda sedang dalam antrian verifikasi. Tim admin akan meninjau dalam 3–5 hari kerja. Anda akan menerima notifikasi ketika status berubah."}
          </p>
          <Button
            className="mt-6"
            variant={isDraft ? "outline" : "default"}
            onClick={() => {
              if (isDraft) {
                setSubmitted(false);
              }
            }}
          >
            {isDraft ? "Lanjutkan Pengisian" : "Kembali ke Dashboard Penginapan"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const StepContent = [
    null,
    StepBasicInfo,
    StepLocation,
    StepPhotos,
    StepFacilities,
    StepDocuments,
    StepPricing,
    StepReview,
  ][currentStep];

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="space-y-6">
      {/* Progress stepper */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => isDone && setCurrentStep(step.id)}
                    disabled={!isDone}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-ambient"
                        : isDone
                        ? "cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-surface-container text-on-surface/40"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </button>
                  <span
                    className={`hidden w-20 text-center text-[10px] sm:block ${
                      isActive
                        ? "font-semibold text-primary"
                        : isDone
                        ? "text-primary"
                        : "text-on-surface/40"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mb-4 h-px w-10 sm:w-12 ${step.id < currentStep ? "bg-primary/40" : "bg-surface-container-high"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{STEPS[currentStep - 1].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {StepContent && <StepContent data={formData} onChange={onChange} />}
        </CardContent>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mx-6 mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-xs font-medium text-red-700">Mohon perbaiki kesalahan berikut:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {errors.map((err) => (
                <li key={err} className="text-xs text-red-600">
                  {err}
                </li>
              ))}
            </ul>
          </div>
        )}

        <CardFooter className="flex justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <div className="flex gap-2">
            {isLastStep ? (
              <>
                <Button type="button" variant="outline" onClick={handleDraft}>
                  Simpan Draft
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  <Send className="h-4 w-4" />
                  Ajukan untuk Verifikasi
                </Button>
              </>
            ) : (
              <Button type="button" onClick={goNext}>
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <p className="text-center text-xs text-on-surface/40">
        Langkah {currentStep} dari {STEPS.length}
      </p>
    </div>
  );
}
