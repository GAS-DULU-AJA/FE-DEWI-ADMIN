"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Star, Pin, PinOff, Pencil, Trash2, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { TESTIMONIALS } from "../mock-data";
import type { Testimonial } from "../types";

const MAX_PINNED = 3;

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < value ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

function AvatarCell({ name, avatar }: { name: string; avatar?: string }) {
  const [failed, setFailed] = useState(false);
  if (avatar && !failed) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setFailed(true)}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-xs font-semibold text-on-surface/70">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

interface TestimonialFormData {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  isPinned: boolean;
}

const EMPTY_FORM: TestimonialFormData = {
  name: "",
  role: "",
  avatar: "",
  content: "",
  rating: 5,
  isPinned: false,
};

export function TestimonialsTable() {
  const t = useTranslations("village");
  const [items, setItems] = useState<Testimonial[]>(TESTIMONIALS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialFormData>(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  const pinnedCount = items.filter((i) => i.isPinned).length;

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item: Testimonial) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      avatar: item.avatar ?? "",
      content: item.content,
      rating: item.rating,
      isPinned: item.isPinned,
    });
    setShowForm(true);
  }

  function handleSave() {
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...form, avatar: form.avatar || undefined }
            : item,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `tst-${Date.now()}`,
          ...form,
          avatar: form.avatar || undefined,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete(id: string) {
    if (confirm(t("testimonials.deleteConfirm"))) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  function togglePin(id: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (!item.isPinned && pinnedCount >= MAX_PINNED) {
          alert(t("testimonials.maxPinnedWarning"));
          return item;
        }
        return { ...item, isPinned: !item.isPinned };
      }),
    );
  }

  const columns = useMemo((): ColumnDef<Testimonial>[] => [
    {
      id: "avatar",
      header: "",
      accessorKey: "avatar",
      accessorFn: (row) => <AvatarCell name={row.name} avatar={row.avatar} />,
    },
    {
      id: "name",
      header: t("testimonials.columns.name"),
      accessorKey: "name",
      sortable: true,
      accessorFn: (row) => (
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.role}</p>
        </div>
      ),
    },
    {
      id: "rating",
      header: t("testimonials.columns.rating"),
      accessorKey: "rating",
      sortable: true,
      accessorFn: (row) => <StarRating value={row.rating} />,
    },
    {
      id: "content",
      header: t("testimonials.columns.content"),
      accessorKey: "content",
      hideOnMobile: true,
      accessorFn: (row) => (
        <p className="max-w-xs truncate text-sm text-muted-foreground">{row.content}</p>
      ),
    },
    {
      id: "isPinned",
      header: t("testimonials.columns.isPinned"),
      accessorKey: "isPinned",
      accessorFn: (row) =>
        row.isPinned ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            <Pin className="h-3 w-3" />
            {t("testimonials.pinnedBadge")}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      id: "createdAt",
      header: t("testimonials.columns.createdAt"),
      accessorKey: "createdAt",
      sortable: true,
      hideOnMobile: true,
    },
  ], [t]);

  return (
    <div className="space-y-4">
      {/* Form panel */}
      {showForm && (
        <Card className="border-primary/30 shadow-ambient">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {editingId ? t("testimonials.editTestimonial") : t("testimonials.addTestimonial")}
              </CardTitle>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("testimonials.fields.name")}</Label>
                <Input
                  placeholder={t("testimonials.fields.namePlaceholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("testimonials.fields.role")}</Label>
                <Input
                  placeholder={t("testimonials.fields.rolePlaceholder")}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("testimonials.fields.avatar")}</Label>
                <Input
                  placeholder={t("testimonials.fields.avatarPlaceholder")}
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("testimonials.fields.rating")}</Label>
                <div className="flex gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${n <= form.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground hover:fill-amber-200 hover:text-amber-200"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>{t("testimonials.fields.content")}</Label>
                <Textarea
                  rows={3}
                  placeholder={t("testimonials.fields.contentPlaceholder")}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={form.isPinned}
                  onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <div>
                  <Label htmlFor="isPinned">{t("testimonials.fields.isPinned")}</Label>
                  <p className="text-xs text-muted-foreground">{t("testimonials.fields.isPinnedHint")}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
              >
                {t("testimonials.actions.cancel")}
              </Button>
              <Button
                size="sm"
                disabled={!form.name.trim() || !form.content.trim()}
                onClick={handleSave}
              >
                {t("testimonials.actions.save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("testimonials.title")}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("testimonials.subtitle")} &mdash;{" "}
                <span className="font-medium text-foreground">{pinnedCount}/{MAX_PINNED}</span>{" "}
                {t("testimonials.pinnedBadge").toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" /> {t("testimonials.saved")}
                </span>
              )}
              <Button size="sm" onClick={openAdd}>
                {t("testimonials.addTestimonial")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={items}
            columns={columns}
            keyExtractor={(r) => r.id}
            searchableFields={["name", "role", "content"]}
            searchPlaceholder={`${t("testimonials.columns.name")}, ${t("testimonials.columns.content")}...`}
            pageSize={10}
            emptyState={{ title: t("testimonials.empty") }}
            actions={(row) => [
              {
                label: row.isPinned ? t("testimonials.actions.unpin") : t("testimonials.actions.pin"),
                icon: row.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />,
                onClick: () => togglePin(row.id),
              },
              {
                label: t("testimonials.actions.edit"),
                icon: <Pencil className="h-3.5 w-3.5" />,
                onClick: () => openEdit(row),
              },
              {
                label: t("testimonials.actions.delete"),
                icon: <Trash2 className="h-3.5 w-3.5" />,
                onClick: () => handleDelete(row.id),
                variant: "destructive" as const,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
