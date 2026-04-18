"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, GripVertical, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProfileSection, ProfileSectionType } from "../types";

interface ProfileSectionEditorProps {
  sections: ProfileSection[];
  onChange: (sections: ProfileSection[]) => void;
}

const SECTION_TYPES: ProfileSectionType[] = ["history", "vision_mission", "culture", "geography", "custom"];

function createEmptySection(): ProfileSection {
  return {
    id: `vps-${Date.now()}`,
    type: "custom",
    title: "",
    content: { text: "" },
    sortOrder: 0,
    isVisible: true,
  };
}

function SectionContentEditor({
  section,
  onContentChange,
}: {
  section: ProfileSection;
  onContentChange: (content: Record<string, any>) => void;
}) {
  const t = useTranslations("village");

  if (section.type === "vision_mission") {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-xs">{t("villageData.profileSections.vision")}</Label>
          <Textarea
            className="text-xs"
            rows={2}
            value={section.content.vision ?? ""}
            onChange={(e) => onContentChange({ ...section.content, vision: e.target.value })}
            placeholder={t("villageData.profileSections.visionPlaceholder")}
          />
        </div>
        <div>
          <Label className="text-xs">{t("villageData.profileSections.mission")}</Label>
          <Textarea
            className="text-xs"
            rows={4}
            value={Array.isArray(section.content.mission) ? section.content.mission.join("\n") : ""}
            onChange={(e) =>
              onContentChange({
                ...section.content,
                mission: e.target.value.split("\n").filter((line: string) => line.trim()),
              })
            }
            placeholder={t("villageData.profileSections.missionPlaceholder")}
          />
          <p className="text-xs text-muted-foreground mt-1">{t("villageData.profileSections.missionHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Label className="text-xs">{t("villageData.profileSections.content")}</Label>
      <Textarea
        className="text-xs"
        rows={4}
        value={section.content.text ?? ""}
        onChange={(e) => onContentChange({ ...section.content, text: e.target.value })}
        placeholder={t("villageData.profileSections.contentPlaceholder")}
      />
    </div>
  );
}

export function ProfileSectionEditor({ sections, onChange }: ProfileSectionEditorProps) {
  const t = useTranslations("village");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function addSection() {
    const newSection = createEmptySection();
    newSection.sortOrder = sections.length;
    onChange([...sections, newSection]);
    setExpandedId(newSection.id);
  }

  function updateSection(id: string, updates: Partial<ProfileSection>) {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function removeSection(id: string) {
    onChange(sections.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{t("villageData.profileSections.title")}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="mr-1 h-3 w-3" />
          {t("villageData.profileSections.add")}
        </Button>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("villageData.profileSections.empty")}</p>
      )}

      {sections.map((section, index) => {
        const isExpanded = expandedId === section.id;
        return (
          <Card key={section.id} className="border">
            <CardContent className="p-3 space-y-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                  <span className="text-sm font-medium">
                    {section.title || t(`villageData.profileSections.types.${section.type}`)}
                  </span>
                  {!section.isVisible && <EyeOff className="h-3 w-3 text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-2 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">{t("villageData.profileSections.type")}</Label>
                      <select
                        value={section.type}
                        onChange={(e) =>
                          updateSection(section.id, { type: e.target.value as ProfileSectionType })
                        }
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      >
                        {SECTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {t(`villageData.profileSections.types.${type}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">{t("villageData.profileSections.sectionTitle")}</Label>
                      <Input
                        className="h-8 text-xs"
                        value={section.title ?? ""}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        placeholder={t(`villageData.profileSections.types.${section.type}`)}
                      />
                    </div>
                  </div>

                  <SectionContentEditor
                    section={section}
                    onContentChange={(content) => updateSection(section.id, { content })}
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={section.isVisible}
                      onChange={(e) => updateSection(section.id, { isVisible: e.target.checked })}
                    />
                    <Label className="text-xs">{t("villageData.profileSections.visible")}</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
