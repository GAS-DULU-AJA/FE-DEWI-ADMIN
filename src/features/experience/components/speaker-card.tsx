"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Speaker } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function SpeakerCard({
  speaker,
  onEdit,
  onDelete,
}: {
  speaker: Speaker;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const t = useTranslations("experience");
  const tc = useTranslations("common");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
              {speaker.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-base">{speaker.name}</CardTitle>
              <p className="text-xs text-stone-500">{speaker.title}</p>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit ? <Button variant="outline" size="sm" onClick={onEdit}>{tc("edit")}</Button> : null}
              {onDelete ? <Button variant="destructive" size="sm" onClick={onDelete}>{tc("delete")}</Button> : null}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-600">
        <p>{speaker.bio}</p>
        <div className="flex flex-wrap gap-1">
          {speaker.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        {speaker.email ? (
          <p className="text-xs text-stone-500">{t("speakers.email")}: {speaker.email}</p>
        ) : null}
        {speaker.socialMedia?.length ? (
          <div className="flex gap-2">
            {speaker.socialMedia.map((sm) => (
              <Badge key={sm.platform} variant="outline" className="text-xs">
                {sm.platform}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
