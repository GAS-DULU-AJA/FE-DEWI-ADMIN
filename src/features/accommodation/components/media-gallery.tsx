"use client";

import { useState } from "react";
import type { AccommodationImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MediaGallery({ images }: { images: AccommodationImage[] }) {
  const [items, setItems] = useState(images);

  function moveItem(id: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
    const cloned = [...items];
    const [picked] = cloned.splice(index, 1);
    cloned.splice(nextIndex, 0, picked);
    setItems(cloned.map((item, idx) => ({ ...item, order: idx + 1 })));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4 text-sm text-on-surface/60">
          Drag and drop upload area is mocked in this implementation.
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((image) => (
            <div key={image.id} className="rounded-lg border border-surface-container-high p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-on-surface">{image.caption ?? image.category}</p>
                  <p className="text-xs text-on-surface/60">{image.category} • {image.width}x{image.height} • {image.sizeKb}KB</p>
                  <p className="text-xs text-on-surface/60">Quality: {image.qualityScore ?? 0}</p>
                  {image.isPrimary ? <p className="text-xs font-medium text-primary">Cover Photo</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => moveItem(image.id, -1)}>Up</Button>
                  <Button variant="outline" size="sm" onClick={() => moveItem(image.id, 1)}>Down</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
