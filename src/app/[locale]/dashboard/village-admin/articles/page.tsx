"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { VillagePageHeader } from "@/features/village/components/page-header";

type ArticleStatus = "draft" | "review" | "scheduled" | "published";

type ArticleRow = {
  id: string;
  title: string;
  category: "news" | "culture" | "event" | "investment";
  author: string;
  views: number;
  publishDate: string;
  status: ArticleStatus;
};

const INITIAL_ARTICLE_ROWS: ArticleRow[] = [
  {
    id: "art-001",
    title: "Festival Panen Kopi Lereng Merapi",
    category: "event",
    author: "Tim Konten Desa",
    views: 5321,
    publishDate: "2026-05-10",
    status: "scheduled",
  },
  {
    id: "art-002",
    title: "Cerita Batik Pewarna Alam dari Kelompok Ibu Desa",
    category: "culture",
    author: "Admin Desa",
    views: 8244,
    publishDate: "2026-04-28",
    status: "published",
  },
  {
    id: "art-003",
    title: "Laporan Kinerja Experience Q1 2026",
    category: "news",
    author: "Sekretariat Desa",
    views: 1320,
    publishDate: "2026-04-15",
    status: "published",
  },
  {
    id: "art-004",
    title: "Peluang Investasi Jalur Trekking Air Terjun",
    category: "investment",
    author: "Pokdarwis",
    views: 910,
    publishDate: "2026-05-20",
    status: "review",
  },
  {
    id: "art-005",
    title: "Panduan Wisata Ramah Lingkungan",
    category: "news",
    author: "Tim Promosi",
    views: 0,
    publishDate: "2026-05-25",
    status: "draft",
  },
];

function ArticleStatusBadge({ status, isId }: { status: ArticleStatus; isId: boolean }) {
  if (status === "published") {
    return <Badge className="bg-emerald-600 text-white">{isId ? "Terbit" : "Published"}</Badge>;
  }
  if (status === "scheduled") {
    return <Badge variant="secondary">{isId ? "Terjadwal" : "Scheduled"}</Badge>;
  }
  if (status === "review") {
    return <Badge className="bg-amber-500 text-white">{isId ? "Review" : "Review"}</Badge>;
  }
  return <Badge variant="outline">{isId ? "Draft" : "Draft"}</Badge>;
}

function toCategoryLabel(category: ArticleRow["category"], isId: boolean) {
  if (category === "news") return isId ? "Berita" : "News";
  if (category === "culture") return isId ? "Budaya" : "Culture";
  if (category === "event") return "Event";
  return isId ? "Investasi" : "Investment";
}

export default function VillageArticlesPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const [rows, setRows] = useState<ArticleRow[]>(INITIAL_ARTICLE_ROWS);
  const [selectedArticle, setSelectedArticle] = useState<ArticleRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
  const publishedCount = rows.filter((row) => row.status === "published").length;
  const scheduledCount = rows.filter((row) => row.status === "scheduled").length;

  function createDraftArticle() {
    const idSuffix = String(Date.now()).slice(-6);
    const date = new Date().toISOString().slice(0, 10);
    const nextDraft: ArticleRow = {
      id: `art-${idSuffix}`,
      title: isId ? "Draft Experience Baru" : "New Experience Draft",
      category: "news",
      author: isId ? "Admin Desa" : "Village Admin",
      views: 0,
      publishDate: date,
      status: "draft",
    };
    setRows((prev) => [nextDraft, ...prev]);
  }

  function openDetail(row: ArticleRow) {
    setSelectedArticle(row);
    setIsDetailOpen(true);
  }

  function togglePublish(row: ArticleRow) {
    const nextStatus: ArticleStatus = row.status === "published" ? "draft" : "published";
    const nextDate = new Date().toISOString().slice(0, 10);

    setRows((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
              ...item,
              status: nextStatus,
              publishDate: nextDate,
            }
          : item,
      ),
    );

    setSelectedArticle((prev) =>
      prev && prev.id === row.id
        ? {
            ...prev,
            status: nextStatus,
            publishDate: nextDate,
          }
        : prev,
    );
  }

  const columns = useMemo<ColumnDef<ArticleRow>[]>(
    () => [
      {
        id: "title",
        header: isId ? "Judul Artikel" : "Article Title",
        accessorFn: (row) => (
          <div className="space-y-0.5">
            <p className="font-medium text-on-surface">{row.title}</p>
            <p className="text-xs text-on-surface/60">
              {isId ? "Penulis" : "Author"}: {row.author}
            </p>
          </div>
        ),
        sortable: true,
      },
      {
        id: "category",
        header: isId ? "Kategori" : "Category",
        accessorKey: "category",
        filterable: true,
        filterOptions: [
          { value: "news", label: isId ? "Berita" : "News" },
          { value: "culture", label: isId ? "Budaya" : "Culture" },
          { value: "event", label: "Event" },
          { value: "investment", label: isId ? "Investasi" : "Investment" },
        ],
        accessorFn: (row) => toCategoryLabel(row.category, isId),
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "draft", label: isId ? "Draft" : "Draft" },
          { value: "review", label: "Review" },
          { value: "scheduled", label: isId ? "Terjadwal" : "Scheduled" },
          { value: "published", label: isId ? "Terbit" : "Published" },
        ],
        accessorFn: (row) => <ArticleStatusBadge status={row.status} isId={isId} />,
      },
      {
        id: "views",
        header: "Views",
        accessorFn: (row) => row.views.toLocaleString(),
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "publishDate",
        header: isId ? "Tanggal Publikasi" : "Publish Date",
        accessorFn: (row) => new Date(row.publishDate).toLocaleDateString(locale),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [isId, locale],
  );

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={isId ? "Artikel & Berita Desa" : "Village Articles & News"}
        description={
          isId
            ? "Kelola editorial desa agar promosi experience, budaya, dan peluang investasi tampil lebih profesional."
            : "Manage village editorial content to present experiences, culture, and investment opportunities professionally."
        }
        breadcrumbs={[
          { label: isId ? "Dashboard" : "Dashboard", href: "/dashboard/village-admin" },
          { label: isId ? "Artikel & Berita" : "Articles & News" },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/village-admin/media">{isId ? "Kelola Media" : "Manage Media"}</Link>
            </Button>
            <Button size="sm" onClick={createDraftArticle}>
              {isId ? "Buat Artikel Baru" : "Create New Article"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Artikel" : "Total Articles"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Artikel Terbit" : "Published"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{publishedCount}</p>
            <p className="text-xs text-on-surface/50">{isId ? `${scheduledCount} terjadwal` : `${scheduledCount} scheduled`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Views" : "Total Views"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Pipeline Konten" : "Content Pipeline"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["title", "author"]}
            searchPlaceholder={isId ? "Cari judul atau penulis..." : "Search by title or author..."}
            pageSize={10}
            actions={(row) => [
              {
                label: isId ? "Lihat" : "View",
                onClick: () => openDetail(row),
              },
              {
                label: row.status === "published" ? (isId ? "Jadikan Draft" : "Set Draft") : "Publish",
                onClick: () => togglePublish(row),
              },
            ]}
            mobileCardRenderer={(row) => (
              <div className="space-y-2">
                <p className="font-medium text-on-surface">{row.title}</p>
                <p className="text-xs text-on-surface/60">{row.author}</p>
                <div className="flex items-center justify-between">
                  <ArticleStatusBadge status={row.status} isId={isId} />
                  <span className="text-xs text-on-surface/60">{row.views.toLocaleString()} views</span>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title ?? (isId ? "Detail Artikel" : "Article Detail")}</DialogTitle>
            <DialogDescription>
              {selectedArticle
                ? `${isId ? "Penulis" : "Author"}: ${selectedArticle.author}`
                : isId
                ? "Pilih artikel untuk melihat detail."
                : "Select an article to view detail."}
            </DialogDescription>
          </DialogHeader>

          {selectedArticle ? (
            <div className="space-y-3 text-sm text-on-surface/70">
              <div className="flex items-center gap-2">
                <span className="text-on-surface/50">{isId ? "Status" : "Status"}:</span>
                <ArticleStatusBadge status={selectedArticle.status} isId={isId} />
              </div>
              <p>
                <span className="text-on-surface/50">{isId ? "Kategori" : "Category"}:</span>{" "}
                {toCategoryLabel(selectedArticle.category, isId)}
              </p>
              <p>
                <span className="text-on-surface/50">Views:</span> {selectedArticle.views.toLocaleString()}
              </p>
              <p>
                <span className="text-on-surface/50">{isId ? "Tanggal Publikasi" : "Publish Date"}:</span>{" "}
                {new Date(selectedArticle.publishDate).toLocaleDateString(locale)}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              {isId ? "Tutup" : "Close"}
            </Button>
            {selectedArticle ? (
              <Button onClick={() => togglePublish(selectedArticle)}>
                {selectedArticle.status === "published"
                  ? isId
                    ? "Jadikan Draft"
                    : "Set Draft"
                  : "Publish"}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
