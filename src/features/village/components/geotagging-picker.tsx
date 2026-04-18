"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

type GeotaggingPickerProps = {
  latitude?: number;
  longitude?: number;
  address?: string;
  onLocationChange: (lat: number, lng: number) => void;
  onGetCurrentLocation?: () => void;
};

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function GeotaggingPicker({
  latitude,
  longitude,
  address,
  onLocationChange,
  onGetCurrentLocation,
}: GeotaggingPickerProps) {
  const t = useTranslations("village");
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(
    latitude && longitude ? [latitude, longitude] : [-6.9175, 107.6191]
  );

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(t("facilities.geotagging.geolocationUnsupported"));
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationChange(lat, lng);
        setMapCenter([lat, lng]);
        setIsGettingLocation(false);
      },
      () => {
        alert(t("facilities.geotagging.getLocationFailed"));
        setIsGettingLocation(false);
      }
    );
  };

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {t("facilities.geotagging.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-stone-600">
          {address && <p className="font-medium mb-2">{address}</p>}
          <p>{t("facilities.geotagging.description")}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="w-full"
        >
          {isGettingLocation
            ? t("facilities.geotagging.gettingLocation")
            : t("facilities.geotagging.useCurrentLocation")}
        </Button>

        <div className="overflow-hidden rounded-lg border border-stone-200" style={{ height: "300px" }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {latitude && longitude && (
              <Marker position={[latitude, longitude]}>
                <Popup>{address || t("facilities.geotagging.popupFallback")}</Popup>
              </Marker>
            )}
            <MapClickHandler onLocationChange={onLocationChange} />
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">{t("villageData.latitude")}</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={latitude ?? ""}
              readOnly
              className="bg-stone-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">{t("villageData.longitude")}</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={longitude ?? ""}
              readOnly
              className="bg-stone-50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
