"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
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

  const columns = useMemo<ColumnDef<Speaker>[]>(
    () => [
      {
        id: "name",
        header: isId ? "Nama" : "Name",
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "title",
        header: isId ? "Jabatan" : "Title",
        accessorKey: "title",
        sortable: true,
      },
      {
        id: "topics",
        header: isId ? "Topik" : "Topics",
        accessorFn: (row) => row.topics.join(", "),
      },
      {
        id: "contact",
        header: isId ? "Kontak" : "Contact",
        accessorFn: (row) => row.email ?? row.phone ?? "-",
        hideOnMobile: true,
      },
    ],
    [isId],
  );

  const actions = (speaker: Speaker): ActionItem[] => [
    {
      label: isId ? "Edit" : "Edit",
      onClick: () => setEditingSpeakerId(speaker.id),
    },
    {
      label: isId ? "Hapus" : "Delete",
      onClick: () => handleDeleteSpeaker(speaker.id),
      variant: "destructive",
    },
  ];

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

      <DataTable
        data={speakers}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["name", "title", "bio", "email", "phone"]}
        searchPlaceholder={isId ? "Cari speaker..." : "Search speakers..."}
        pageSize={10}
        actions={actions}
        emptyState={{
          title: isId ? "Belum ada speaker" : "No speakers yet",
          description: isId
            ? "Tambahkan speaker pertama Anda."
            : "Add your first speaker.",
        }}
        mobileCardRenderer={(speaker) => (
          <SpeakerCard
            speaker={speaker}
            onEdit={() => setEditingSpeakerId(speaker.id)}
            onDelete={() => handleDeleteSpeaker(speaker.id)}
          />
        )}
      />
    </div>
  );
}
