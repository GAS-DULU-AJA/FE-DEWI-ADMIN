"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  ACCOMMODATIONS,
  AccommodationCard,
  AccommodationPageHeader,
  PropertySwitcher,
} from "@/features/accommodation";
import { Plus } from "lucide-react";

export default function PenginapanDashboard() {
  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Manajemen Penginapan"
        description="Satu akun dapat mengelola beberapa properti penginapan."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan" },
        ]}
        backHref="/dashboard"
        action={
          <Button asChild>
            <Link href="/dashboard/penginapan/tambah">
              <Plus className="h-4 w-4" />
              Tambah Penginapan
            </Link>
          </Button>
        }
      />

      <PropertySwitcher accommodations={ACCOMMODATIONS} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ACCOMMODATIONS.map((accommodation) => (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
          />
        ))}
      </div>
    </div>
  );
}
