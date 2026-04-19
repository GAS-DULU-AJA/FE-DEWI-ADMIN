"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/ui/form-modal";
import type { Speaker } from "@/features/experience/types";
import { useTranslations } from "next-intl";

type SpeakerFormValue = {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  topics: string;
};

export function SpeakerForm({
  open,
  onOpenChange,
  mode = "create",
  initialValue,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  initialValue?: Speaker;
  onSubmit: (value: SpeakerFormValue) => void;
}) {
  const t = useTranslations("experience");
  const [name, setName] = useState(initialValue?.name ?? "");
  const [speakerTitle, setSpeakerTitle] = useState(initialValue?.title ?? "");
  const [bio, setBio] = useState(initialValue?.bio ?? "");
  const [email, setEmail] = useState(initialValue?.email ?? "");
  const [phone, setPhone] = useState(initialValue?.phone ?? "");
  const [topics, setTopics] = useState(initialValue?.topics.join(", ") ?? "");

  const submitLabel = mode === "create" ? t("speakers.save") : "Update Speaker";

  const handleSubmit = () => {
    onSubmit({ name, title: speakerTitle, bio, email, phone, topics });
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? t("speakers.addSpeaker") : "Edit Speaker"}
      size="md"
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("speakers.name")}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("speakers.namePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("speakers.titleLabel")}</Label>
          <Input value={speakerTitle} onChange={(e) => setSpeakerTitle(e.target.value)} placeholder={t("speakers.titlePlaceholder")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("speakers.bio")}</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder={t("speakers.bioPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("speakers.email")}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="space-y-2">
          <Label>{t("speakers.phone")}</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xx-xxxx-xxxx" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("speakers.topics")}</Label>
          <Input
            placeholder={t("speakers.topicsPlaceholder")}
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
          <p className="text-xs text-stone-500">{t("speakers.topicsHint")}</p>
        </div>
      </div>
    </FormModal>
  );
}
