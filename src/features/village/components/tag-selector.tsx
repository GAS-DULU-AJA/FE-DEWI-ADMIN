"use client";

import { useTranslations } from "next-intl";
import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { VillageTag, VillageTagAssignment } from "../types";

interface TagSelectorProps {
  availableTags: VillageTag[];
  assignments: VillageTagAssignment[];
  onAssign: (tagId: string) => void;
  onRemove: (tagId: string) => void;
}

export function TagSelector({ availableTags, assignments, onAssign, onRemove }: TagSelectorProps) {
  const t = useTranslations("village");
  const assignedTagIds = new Set(assignments.map((a) => a.tagId));

  const groupedTags = availableTags.reduce<Record<string, VillageTag[]>>((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <Label className="text-sm font-medium">{t("villageData.tags.title")}</Label>
      </div>

      {assignments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assignments.map((assignment) => (
            <Badge key={assignment.id} variant="secondary" className="gap-1 pr-1">
              {assignment.tag.name}
              <button
                type="button"
                onClick={() => onRemove(assignment.tagId)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {Object.entries(groupedTags).map(([category, tags]) => {
        const unassigned = tags.filter((tag) => !assignedTagIds.has(tag.id));
        if (unassigned.length === 0) return null;

        return (
          <div key={category} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {t(`villageData.tags.categories.${category}`)}
            </p>
            <div className="flex flex-wrap gap-1">
              {unassigned.map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onAssign(tag.id)}
                >
                  + {tag.name}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
