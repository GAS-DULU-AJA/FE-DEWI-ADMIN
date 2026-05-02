"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const GeotaggingPicker = dynamic(() => import("./geotagging-picker").then(m => m.GeotaggingPicker), { ssr: false, loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" /> });
import type { Facility } from "../types";
import type { FacilityInput } from "../stores/facility-management-store";

type FacilityFormProps = {
  initialFacility?: Facility | null;
  onSubmit: (payload: FacilityInput) => void;
  onCancel?: () => void;
};

const defaultValues: FacilityInput = {
  name: "",
  category: "public",
  description: "",
  address: "",
  latitude: undefined,
  longitude: undefined,
  operatingHours: "",
  contact: "",
  isMonetizable: false,
  rentalPrice: undefined,
  capacity: undefined,
  utilizationRate: undefined,
};

function toFormValue(facility: Facility): FacilityInput {
  return {
    name: facility.name,
    category: facility.category,
    description: facility.description,
    address: facility.address,
    latitude: facility.latitude,
    longitude: facility.longitude,
    operatingHours: facility.operatingHours ?? "",
    contact: facility.contact ?? "",
    isMonetizable: facility.isMonetizable,
    rentalPrice: facility.rentalPrice,
    capacity: facility.capacity,
    utilizationRate: facility.utilizationRate,
  };
}

function parseNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function FacilityForm({ initialFacility, onSubmit, onCancel }: FacilityFormProps) {
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const [form, setForm] = useState<FacilityInput>(initialFacility ? toFormValue(initialFacility) : defaultValues);
  const [showGeotagging, setShowGeotagging] = useState(false);

  useEffect(() => {
    setForm(initialFacility ? toFormValue(initialFacility) : defaultValues);
  }, [initialFacility]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      operatingHours: form.operatingHours?.trim() || undefined,
      contact: form.contact?.trim() || undefined,
    });

    if (!initialFacility) {
      setForm(defaultValues);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialFacility ? t("facilities.editFacility") : t("facilities.addFacility")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("common.name")}</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("facilities.namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("facilities.category")}</Label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as FacilityInput["category"] })}
              className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm"
            >
              <option value="public">{t("facilities.categories.public")}</option>
              <option value="security">{t("facilities.categories.security")}</option>
              <option value="transportation">{t("facilities.categories.transportation")}</option>
              <option value="monetizable">{t("facilities.categories.monetizable")}</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t("common.description")}</Label>
            <Textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={t("facilities.descriptionPlaceholder")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t("villageData.address")}</Label>
            <Input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder={t("facilities.addressPlaceholder")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGeotagging(!showGeotagging)}
              className="w-full"
            >
              {showGeotagging
                ? t("facilities.geotagging.hide")
                : t("facilities.geotagging.show")}
            </Button>

            {!showGeotagging ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("villageData.latitude")}</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={form.latitude ?? ""}
                    onChange={(e) => setForm({ ...form, latitude: parseNumber(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("villageData.longitude")}</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={form.longitude ?? ""}
                    onChange={(e) => setForm({ ...form, longitude: parseNumber(e.target.value) })}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {showGeotagging ? (
            <div className="md:col-span-2">
              <GeotaggingPicker
                latitude={form.latitude}
                longitude={form.longitude}
                address={form.address}
                onLocationChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>{t("facilities.operatingHours")}</Label>
            <Input
              value={form.operatingHours ?? ""}
              onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
              placeholder={t("facilities.operatingHoursPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("facilities.contact")}</Label>
            <Input
              value={form.contact ?? ""}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder={t("facilities.contactPlaceholder")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-on-surface/80 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isMonetizable}
              onChange={(e) => setForm({ ...form, isMonetizable: e.target.checked })}
            />
            {t("facilities.isMonetizable")}
          </label>

          {form.isMonetizable ? (
            <div className="space-y-2">
              <Label>{t("facilities.rentalPrice")}</Label>
              <Input
                type="number"
                min={0}
                value={form.rentalPrice ?? ""}
                onChange={(e) => setForm({ ...form, rentalPrice: parseNumber(e.target.value) })}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>{t("facilities.capacity")}</Label>
            <Input
              type="number"
              min={0}
              value={form.capacity ?? ""}
              onChange={(e) => setForm({ ...form, capacity: parseNumber(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("facilities.utilizationLabel")}</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.utilizationRate ?? ""}
              onChange={(e) => setForm({ ...form, utilizationRate: parseNumber(e.target.value) })}
              placeholder={t("facilities.utilizationPlaceholder")}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            {initialFacility ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                {tc("cancel")}
              </Button>
            ) : null}
            <Button type="submit">
              {initialFacility ? t("facilities.updateFacility") : t("actions.saveFacility")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
