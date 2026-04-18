"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { SocialMediaPlatform, VillageSocialMedia } from "../types";

interface SocialMediaListEditorProps {
  items: VillageSocialMedia[];
  onChange: (items: VillageSocialMedia[]) => void;
}

const PLATFORMS: SocialMediaPlatform[] = [
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
  "twitter",
  "website",
  "other",
];

function createEmptyItem(): VillageSocialMedia {
  return {
    id: `vsm-${Date.now()}`,
    platform: "instagram",
    url: "",
    sortOrder: 0,
  };
}

export function SocialMediaListEditor({ items, onChange }: SocialMediaListEditorProps) {
  const t = useTranslations("village");

  function addItem() {
    const newItem = createEmptyItem();
    newItem.sortOrder = items.length;
    onChange([...items, newItem]);
  }

  function updateItem(id: string, updates: Partial<VillageSocialMedia>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{t("villageData.socialMediaEditor.title")}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1 h-3 w-3" />
          {t("villageData.socialMediaEditor.add")}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("villageData.socialMediaEditor.empty")}</p>
      )}

      {items.map((item, index) => (
        <Card key={item.id} className="border">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t("villageData.socialMediaEditor.platform")}</Label>
                <select
                  value={item.platform}
                  onChange={(e) =>
                    updateItem(item.id, { platform: e.target.value as SocialMediaPlatform })
                  }
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {t(`villageData.socialMediaEditor.platforms.${platform}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">{t("villageData.socialMediaEditor.label")}</Label>
                <Input
                  className="h-8 text-xs"
                  value={item.label ?? ""}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder={t("villageData.socialMediaEditor.labelPlaceholder")}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">{t("villageData.socialMediaEditor.url")}</Label>
              <Input
                className="h-8 text-xs"
                value={item.url}
                onChange={(e) => updateItem(item.id, { url: e.target.value })}
                placeholder={t("villageData.socialMediaEditor.urlPlaceholder")}
              />
            </div>

            <div>
              <Label className="text-xs">{t("villageData.socialMediaEditor.username")}</Label>
              <Input
                className="h-8 text-xs"
                value={item.username ?? ""}
                onChange={(e) => updateItem(item.id, { username: e.target.value })}
                placeholder={t("villageData.socialMediaEditor.usernamePlaceholder")}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
