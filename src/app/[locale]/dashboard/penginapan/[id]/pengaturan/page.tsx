import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AccommodationPageHeader, getAccommodationById } from "@/features/accommodation";

export default async function PropertySettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Pengaturan Penginapan"
        description={accommodation.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/penginapan" },
          { label: accommodation.name, href: `/dashboard/penginapan/${id}` },
          { label: "Pengaturan" },
        ]}
        backHref={`/dashboard/penginapan/${id}`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Publik</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Nama Penginapan</Label>
            <Input id="name" defaultValue={accommodation.name} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
            <Input id="shortDescription" defaultValue={accommodation.shortDescription} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Deskripsi Lengkap</Label>
            <Textarea id="description" rows={5} defaultValue={accommodation.description} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min">Harga Minimum</Label>
            <Input id="min" type="number" defaultValue={accommodation.priceRange.min} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Harga Maksimum</Label>
            <Input id="max" type="number" defaultValue={accommodation.priceRange.max} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
