"use client";

import { useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { Loader2, MapPinned, Search } from "lucide-react";
import { useTranslations } from "next-intl";

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

interface VillageLocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (latitude: number, longitude: number) => void;
  serviceMarkers?: {
    id: string;
    name: string;
    typeLabel: string;
    latitude: number;
    longitude: number;
    priorityLabels: string[];
  }[];
}

const DEFAULT_CENTER: LatLngExpression = [-2.5489, 118.0149];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ position }: { position: LatLngExpression }) {
  const map = useMap();
  map.setView(position, 15);
  return null;
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function VillageLocationPicker({
  latitude,
  longitude,
  onLocationChange,
  serviceMarkers = [],
}: VillageLocationPickerProps) {
  const t = useTranslations("village");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const hasValidCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);

  const position = useMemo<LatLngExpression>(() => {
    if (hasValidCoordinates) {
      return [latitude, longitude];
    }
    return DEFAULT_CENTER;
  }, [hasValidCoordinates, latitude, longitude]);

  async function handleSearch() {
    const normalized = query.trim();
    if (!normalized) {
      setResults([]);
      setSearchError("");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError("");

      const endpoint = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=id&q=${encodeURIComponent(normalized)}`;
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("location-search-failed");
      }

      const data = (await response.json()) as SearchResult[];
      setResults(data);

      if (data.length === 0) {
        setSearchError(t("villageData.map.noResults"));
      }
    } catch {
      setSearchError(t("villageData.map.searchFailed"));
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function pickLocation(lat: number, lng: number) {
    onLocationChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  }

  const currentLatLng = hasValidCoordinates ? ([latitude, longitude] as LatLngExpression) : null;

  return (
    <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("villageData.map.title")}</p>
        <p className="text-xs text-muted-foreground">{t("villageData.map.description")}</p>
      </div>

      <div className="rounded-lg border bg-background p-3">
        <label className="mb-2 block text-xs font-medium text-muted-foreground">{t("villageData.map.searchLabel")}</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSearch();
                }
              }}
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm"
              placeholder={t("villageData.map.searchPlaceholder")}
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={isSearching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPinned className="h-4 w-4" />}
            {t("villageData.map.searchAction")}
          </button>
        </div>

        {searchError ? <p className="mt-2 text-xs text-amber-600">{searchError}</p> : null}

        {results.length > 0 ? (
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/30 p-1.5">
            {results.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => {
                  pickLocation(Number(result.lat), Number(result.lon));
                  setQuery(result.display_name);
                  setResults([]);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-emerald-50"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <MapContainer
          center={position}
          zoom={currentLatLng ? 15 : 5}
          className="h-80 w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onPick={pickLocation} />
          <RecenterMap position={position} />

          {currentLatLng ? (
            <Marker
              position={currentLatLng}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target;
                  const next = marker.getLatLng();
                  pickLocation(next.lat, next.lng);
                },
              }}
            >
              <Popup>
                {t("villageData.map.selectedLabel")}
                <br />
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Popup>
            </Marker>
          ) : null}

          {serviceMarkers.map((service) => (
            <CircleMarker
              key={service.id}
              center={[service.latitude, service.longitude]}
              radius={7}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#3b82f6",
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <p className="font-semibold leading-snug">{service.name}</p>
                <p className="text-xs text-muted-foreground leading-snug">{service.typeLabel}</p>
                {service.priorityLabels.length > 0 ? (
                  <p className="text-xs">{service.priorityLabels.join(" · ")}</p>
                ) : null}
                <p className="text-xs">
                  {service.latitude.toFixed(6)}, {service.longitude.toFixed(6)}
                </p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p className="text-xs text-muted-foreground">{t("villageData.map.hint")}</p>
    </div>
  );
}