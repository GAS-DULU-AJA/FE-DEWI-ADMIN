"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeakerCard } from "@/features/experience/components/speaker-card";
import { SpeakerForm } from "@/features/experience/components/speaker-form";
import type { Speaker } from "@/features/experience/types";
import { useLocale } from "next-intl";
import { Plus } from "lucide-react";

type SpeakerFormValue = {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  topics: string;
};

export function SpeakersCrudManager({ initialSpeakers }: { initialSpeakers: Speaker[] }) {
  const locale = useLocale();
  const isId = locale === "id";
  const [speakers, setSpeakers] = useState<Speaker[]>(initialSpeakers);
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const editingSpeaker = useMemo(
    () => speakers.find((item) => item.id === editingSpeakerId),
    [editingSpeakerId, speakers]
  );

  const mapToSpeakerPayload = (value: SpeakerFormValue) => ({
    name: value.name.trim(),
    title: value.title.trim(),
    bio: value.bio.trim(),
    email: value.email.trim() || undefined,
    phone: value.phone.trim() || undefined,
    topics: value.topics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean),
  });

  const handleCreateSpeaker = (value: SpeakerFormValue) => {
    const payload = mapToSpeakerPayload(value);
    if (!payload.name || !payload.title || !payload.bio) return;

    const newSpeaker: Speaker = {
      id: `spk-${Date.now()}`,
      name: payload.name,
      title: payload.title,
      bio: payload.bio,
      email: payload.email,
      phone: payload.phone,
      topics: payload.topics,
    };

    setSpeakers((prev) => [newSpeaker, ...prev]);
  };

  const handleUpdateSpeaker = (value: SpeakerFormValue) => {
    if (!editingSpeakerId) return;

    const payload = mapToSpeakerPayload(value);
    if (!payload.name || !payload.title || !payload.bio) return;

    setSpeakers((prev) =>
      prev.map((item) =>
        item.id === editingSpeakerId
          ? {
              ...item,
              name: payload.name,
              title: payload.title,
              bio: payload.bio,
              email: payload.email,
              phone: payload.phone,
              topics: payload.topics,
            }
          : item
      )
    );
    setEditingSpeakerId(null);
  };

  const handleDeleteSpeaker = (speakerId: string) => {
    setSpeakers((prev) => prev.filter((item) => item.id !== speakerId));
    if (editingSpeakerId === speakerId) {
      setEditingSpeakerId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4" />
          {isId ? "Tambah Speaker" : "Add Speaker"}
        </Button>
      </div>

      <SpeakerForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        mode="create"
        onSubmit={handleCreateSpeaker}
      />

      {editingSpeaker && (
        <SpeakerForm
          open={!!editingSpeakerId}
          onOpenChange={(open) => { if (!open) setEditingSpeakerId(null); }}
          mode="edit"
          initialValue={editingSpeaker}
          onSubmit={handleUpdateSpeaker}
        />
      )}

      {speakers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              onEdit={() => setEditingSpeakerId(speaker.id)}
              onDelete={() => handleDeleteSpeaker(speaker.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600">
          {isId ? "Belum ada speaker. Tambahkan speaker pertama Anda." : "No speakers yet. Add your first speaker."}
        </div>
      )}
    </div>
  );
}
