"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { villageService } from "@/services";
import { applyWatermark } from "@/lib/watermark";
import type { WatermarkConfig } from "@/types";

type GalleryAsset = {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  watermarked: boolean;
};

type UploadProgress = Record<string, number>;

const defaultConfig: WatermarkConfig = {
  enabled: false,
  type: "text",
  text: "Mitra Dewi",
  fontSize: 24,
  fontColor: "#ffffff",
  opacity: 0.3,
  position: "bottom-right",
  padding: 20,
  scale: 0.2,
};

const copy = {
  id: {
    title: "Upload Media & Galeri",
    subtitle: "Upload foto/video desa. Watermark otomatis diterapkan ke gambar saat konfigurasi aktif.",
    files: "Berkas Dipilih",
    upload: "Upload ke Galeri",
    watermarkOn: "Watermark Aktif",
    watermarkOff: "Watermark Nonaktif",
    empty: "Belum ada media di galeri.",
    preview: "Pratinjau Media",
    applyInfo: "Watermark diterapkan pada gambar sebelum upload.",
  },
  en: {
    title: "Media & Gallery Upload",
    subtitle: "Upload village images/videos. Watermark is automatically applied to images when enabled.",
    files: "Selected Files",
    upload: "Upload to Gallery",
    watermarkOn: "Watermark Enabled",
    watermarkOff: "Watermark Disabled",
    empty: "No media in gallery yet.",
    preview: "Media Preview",
    applyInfo: "Watermark is applied to images before upload.",
  },
  ja: {
    title: "メディア・ギャラリーアップロード",
    subtitle: "村の画像・動画をアップロードします。設定が有効な場合、画像に自動で透かしが適用されます。",
    files: "選択したファイル",
    upload: "ギャラリーにアップロード",
    watermarkOn: "透かし有効",
    watermarkOff: "透かし無効",
    empty: "ギャラリーにメディアがありません。",
    preview: "メディアプレビュー",
    applyInfo: "アップロード前に画像へ透かしを適用します。",
  },
} as const;

export function MediaUpload({ villageId = "village-1" }: { villageId?: string }) {
  const locale = useLocale() as keyof typeof copy;
  const t = copy[locale] ?? copy.en;

  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<WatermarkConfig>(defaultConfig);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});
  const [gallery, setGallery] = useState<GalleryAsset[]>([]);
  const [preview, setPreview] = useState<GalleryAsset | null>(null);

  const canUpload = files.length > 0 && !uploading;

  useEffect(() => {
    let mounted = true;
    villageService
      .getWatermarkConfig()
      .then((response) => {
        if (mounted) {
          setConfig(response.data ?? defaultConfig);
        }
      })
      .catch(() => {
        if (mounted) {
          setConfig(defaultConfig);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    const uploaded: GalleryAsset[] = [];

    for (const file of files) {
      const fileKey = `${file.name}-${file.size}`;
      setProgress((prev) => ({ ...prev, [fileKey]: 15 }));

      const processedFile = await applyWatermark(file, config);
      setProgress((prev) => ({ ...prev, [fileKey]: 55 }));

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("name", processedFile.name);
      formData.append("watermarked", String(config.enabled && file.type.startsWith("image/")));

      let uploadedUrl = URL.createObjectURL(processedFile);
      try {
        const response = await villageService.uploadGallery(villageId, formData);
        if (response.data?.url) {
          uploadedUrl = response.data.url;
        }
      } catch {
        uploadedUrl = URL.createObjectURL(processedFile);
      }

      setProgress((prev) => ({ ...prev, [fileKey]: 100 }));

      uploaded.push({
        id: `${Date.now()}-${fileKey}`,
        name: processedFile.name,
        url: uploadedUrl,
        type: processedFile.type.startsWith("video/") ? "video" : "image",
        watermarked: config.enabled && file.type.startsWith("image/"),
      });
    }

    setGallery((prev) => [...uploaded, ...prev]);
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{t.title}</CardTitle>
          <p className="text-sm text-on-surface/60">{t.subtitle}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={config.enabled ? "default" : "secondary"}>
              {config.enabled ? t.watermarkOn : t.watermarkOff}
            </Badge>
            {config.enabled ? <p className="text-xs text-on-surface/60">{t.applyInfo}</p> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            accept="image/jpeg,image/png,image/webp,video/mp4"
            multiple
            maxSize={15}
            value={files}
            onChange={setFiles}
          />

          {files.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-on-surface/80">{t.files}</p>
              {files.map((file) => {
                const key = `${file.name}-${file.size}`;
                const value = progress[key] ?? 0;
                return (
                  <div key={key} className="rounded-lg border border-surface-container-high p-2">
                    <div className="mb-1 flex items-center justify-between text-xs text-on-surface/70">
                      <span className="truncate">{file.name}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container">
                      <div className="h-2 rounded-full bg-primary/100 transition-all" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <Button onClick={handleUpload} disabled={!canUpload}>
            {t.upload}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {gallery.length === 0 ? (
            <p className="text-sm text-on-surface/60">{t.empty}</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreview(item)}
                  className="overflow-hidden rounded-xl border border-surface-container-high text-left transition hover:border-primary/400"
                >
                  <div className="aspect-video bg-surface-container">
                    {item.type === "video" ? (
                      <video src={item.url} className="h-full w-full object-cover" muted />
                    ) : (
                      <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="space-y-1 p-2">
                    <p className="truncate text-sm font-medium text-on-surface">{item.name}</p>
                    {item.watermarked ? <Badge variant="outline">WM</Badge> : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.name ?? t.preview}</DialogTitle>
          </DialogHeader>
          {preview ? (
            preview.type === "video" ? (
              <video className="max-h-[70vh] w-full rounded-lg bg-black" src={preview.url} controls preload="metadata" />
            ) : (
              <img src={preview.url} alt={preview.name} className="max-h-[70vh] w-full rounded-lg object-contain" />
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
