"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { ContactType, VillageContact } from "../types";

interface ContactListEditorProps {
  contacts: VillageContact[];
  onChange: (contacts: VillageContact[]) => void;
}

const CONTACT_TYPES: ContactType[] = ["phone", "email", "whatsapp", "fax", "hotline", "other"];

function createEmptyContact(): VillageContact {
  return {
    id: `vc-${Date.now()}`,
    type: "phone",
    label: "",
    value: "",
    isPrimary: false,
    sortOrder: 0,
  };
}

export function ContactListEditor({ contacts, onChange }: ContactListEditorProps) {
  const t = useTranslations("village");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function addContact() {
    const newContact = createEmptyContact();
    newContact.sortOrder = contacts.length;
    onChange([...contacts, newContact]);
    setExpandedId(newContact.id);
  }

  function updateContact(id: string, updates: Partial<VillageContact>) {
    onChange(
      contacts.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  function removeContact(id: string) {
    onChange(contacts.filter((c) => c.id !== id));
  }

  function setPrimary(id: string) {
    onChange(
      contacts.map((c) => ({ ...c, isPrimary: c.id === id }))
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{t("villageData.contacts.title")}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addContact}>
          <Plus className="mr-1 h-3 w-3" />
          {t("villageData.contacts.add")}
        </Button>
      </div>

      {contacts.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("villageData.contacts.empty")}</p>
      )}

      {contacts.map((contact, index) => (
        <Card key={contact.id} className="border">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                {contact.isPrimary && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {t("villageData.contacts.primaryBadge")}
                  </span>
                )}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t("villageData.contacts.type")}</Label>
                <select
                  value={contact.type}
                  onChange={(e) =>
                    updateContact(contact.id, { type: e.target.value as ContactType })
                  }
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                >
                  {CONTACT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`villageData.contacts.types.${type}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">{t("villageData.contacts.label")}</Label>
                <Input
                  className="h-8 text-xs"
                  value={contact.label}
                  onChange={(e) => updateContact(contact.id, { label: e.target.value })}
                  placeholder={t("villageData.contacts.labelPlaceholder")}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">{t("villageData.contacts.value")}</Label>
              <Input
                className="h-8 text-xs"
                value={contact.value}
                onChange={(e) => updateContact(contact.id, { value: e.target.value })}
                placeholder={
                  contact.type === "email"
                    ? t("villageData.contacts.valuePlaceholderEmail")
                    : t("villageData.contacts.valuePlaceholderDefault")
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={contact.isPrimary}
                onChange={() => setPrimary(contact.id)}
              />
              <Label className="text-xs">{t("villageData.contacts.primary")}</Label>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
