"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Speaker } from "@/features/experience/types";
import { useLocale } from "next-intl";

export function SpeakerSelector({
  speakers,
  selectedSpeakerIds,
  onToggleSpeaker,
}: {
  speakers: Speaker[];
  selectedSpeakerIds: string[];
  onToggleSpeaker: (speakerId: string) => void;
}) {
  const locale = useLocale();
  const isId = locale === "id";
  const [query, setQuery] = useState("");

  const filteredSpeakers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return speakers;

    return speakers.filter((speaker) => {
      return [speaker.name, speaker.title, speaker.bio, ...(speaker.topics ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [query, speakers]);

  const selectedSpeakers = useMemo(
    () => speakers.filter((speaker) => selectedSpeakerIds.includes(speaker.id)),
    [selectedSpeakerIds, speakers]
  );

  return (
    <div className="space-y-4">
      <Card className="border-surface-container-high shadow-ambient">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                {isId ? "Pilih Pengisi Acara" : "Select Event Speakers"}
              </CardTitle>
              <p className="mt-1 text-sm text-on-surface/60">
                {isId
                  ? "Pengisi acara diambil dari menu Pembicara. Di wizard ini hanya pilih, bukan tambah atau edit."
                  : "Speakers are sourced from the Speakers menu. In this wizard you only select them, not create or edit them."}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {isId
                ? `${selectedSpeakerIds.length} dipilih`
                : `${selectedSpeakerIds.length} selected`}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              isId
                ? "Cari nama, topik, atau jabatan pembicara..."
                : "Search by speaker name, topic, or title..."
            }
          />

          {selectedSpeakers.length > 0 ? (
            <div className="rounded-2xl border border-primary/200 bg-primary/10 p-4">
              <p className="mb-3 text-sm font-semibold text-primary">
                {isId ? "Pengisi acara terpilih" : "Selected speakers"}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSpeakers.map((speaker) => (
                  <button
                    key={speaker.id}
                    type="button"
                    onClick={() => onToggleSpeaker(speaker.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/300 bg-surface-container-lowest px-3 py-2 text-left text-xs text-primary"
                  >
                    <span className="font-semibold">{speaker.name}</span>
                    <span className="text-primary">{speaker.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredSpeakers.map((speaker) => {
              const selected = selectedSpeakerIds.includes(speaker.id);

              return (
                <article
                  key={speaker.id}
                  className={`rounded-2xl border p-4 transition ${
                    selected
                      ? "border-primary/300 bg-primary/10 shadow-ambient"
                      : "border-surface-container-high bg-surface-container-lowest hover:border-surface-container-high"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-sm font-bold text-on-surface/80">
                        {speaker.name
                          .split(" ")
                          .map((chunk) => chunk[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{speaker.name}</p>
                        <p className="text-sm text-on-surface/60">{speaker.title}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={selected ? "outline" : "default"}
                      onClick={() => onToggleSpeaker(speaker.id)}
                    >
                      {selected ? (isId ? "Terpilih" : "Selected") : (isId ? "Pilih" : "Select")}
                    </Button>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-on-surface/70">{speaker.bio}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {speaker.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] text-on-surface/80">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-on-surface/60">
                    {speaker.email ? <span>{speaker.email}</span> : null}
                    {speaker.phone ? <span>{speaker.phone}</span> : null}
                  </div>
                </article>
              );
            })}
          </div>

          {filteredSpeakers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-container-high bg-surface-container-low p-6 text-sm text-on-surface/60">
              {isId ? "Tidak ada pembicara yang cocok dengan pencarian." : "No speakers match your search."}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}