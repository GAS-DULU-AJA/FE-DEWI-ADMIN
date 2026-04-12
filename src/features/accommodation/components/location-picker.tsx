"use client";

import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { Search, Loader2, MapPinned } from "lucide-react";

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

interface LocationPickerProps {
  latitude?: string;
  longitude?: string;
  onLocationChange: (latitude: string, longitude: string) => void;
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

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const parsedLat = latitude ? Number(latitude) : Number.NaN;
  const parsedLng = longitude ? Number(longitude) : Number.NaN;

  const position = useMemo<LatLngExpression>(() => {
    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
      return [parsedLat, parsedLng];
    }
    return DEFAULT_CENTER;
  }, [parsedLat, parsedLng]);

  const handleSearch = async () => {
    const normalized = query.trim();
    if (!normalized) {
      setResults([]);
      setSearchError("");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError("");

      const endpoint =
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=id&q=${encodeURIComponent(normalized)}`;

      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil hasil pencarian lokasi.");
      }

      const data = (await response.json()) as SearchResult[];
      setResults(data);

      if (data.length === 0) {
        setSearchError("Lokasi tidak ditemukan. Coba kata kunci lain.");
      }
    } catch {
      setSearchError("Pencarian lokasi gagal. Coba lagi beberapa saat.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const pickLocation = (lat: number, lng: number) => {
    onLocationChange(lat.toFixed(6), lng.toFixed(6));
  };

  const currentLatLng =
    Number.isFinite(parsedLat) && Number.isFinite(parsedLng)
      ? ([parsedLat, parsedLng] as LatLngExpression)
      : null;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-stone-200 p-3">
        <label className="mb-2 block text-xs font-medium text-stone-600">Cari Lokasi di Peta</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
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
              className="h-10 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm"
              placeholder="Cari alamat, nama tempat, atau area..."
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={isSearching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPinned className="h-4 w-4" />}
            Cari
          </button>
        </div>

        {searchError ? <p className="mt-2 text-xs text-amber-600">{searchError}</p> : null}

        {results.length > 0 ? (
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border border-stone-100 bg-stone-50 p-1.5">
            {results.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => {
                  pickLocation(Number(result.lat), Number(result.lon));
                  setQuery(result.display_name);
                  setResults([]);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs text-stone-700 hover:bg-emerald-50"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200">
        <MapContainer
          center={position}
          zoom={currentLatLng ? 15 : 5}
          className="h-72 w-full"
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
                Koordinat terpilih<br />
                {parsedLat.toFixed(6)}, {parsedLng.toFixed(6)}
              </Popup>
            </Marker>
          ) : null}
        </MapContainer>
      </div>

      <p className="text-xs text-stone-500">
        Klik peta untuk menandai lokasi presisi, lalu geser pin jika perlu.
      </p>
    </div>
  );
}
