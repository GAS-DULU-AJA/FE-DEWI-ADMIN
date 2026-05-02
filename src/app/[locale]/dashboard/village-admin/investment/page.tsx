"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { VillagePageHeader } from "@/features/village/components/page-header";

type InvestmentStatus = "draft" | "open" | "due-diligence" | "funded";

type InvestmentRow = {
  id: string;
  project: string;
  sector: "attraction" | "infrastructure" | "hospitality" | "green-energy";
  target: number;
  committed: number;
  investors: number;
  expectedRoi: string;
  status: InvestmentStatus;
};

const INITIAL_INVESTMENT_ROWS: InvestmentRow[] = [
  {
    id: "inv-001",
    project: "Revitalisasi Area Camping Bukit Pinus",
    sector: "attraction",
    target: 1200000000,
    committed: 840000000,
    investors: 7,
    expectedRoi: "14-16%",
    status: "open",
  },
  {
    id: "inv-002",
    project: "Eco Shuttle Desa Wisata",
    sector: "green-energy",
    target: 950000000,
    committed: 950000000,
    investors: 4,
    expectedRoi: "11-13%",
    status: "funded",
  },
  {
    id: "inv-003",
    project: "Pusat Oleh-oleh & UMKM Hub",
    sector: "infrastructure",
    target: 700000000,
    committed: 300000000,
    investors: 3,
    expectedRoi: "10-12%",
    status: "due-diligence",
  },
  {
    id: "inv-004",
    project: "Pengembangan Homestay Cluster Timur",
    sector: "hospitality",
    target: 1500000000,
    committed: 0,
    investors: 0,
    expectedRoi: "15-18%",
    status: "draft",
  },
];

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSectorLabel(sector: InvestmentRow["sector"], isId: boolean) {
  if (sector === "attraction") return "Experience";
  if (sector === "infrastructure") return isId ? "Infrastruktur" : "Infrastructure";
  if (sector === "hospitality") return "Hospitality";
  return isId ? "Energi Hijau" : "Green Energy";
}

function InvestmentStatusBadge({ status, isId }: { status: InvestmentStatus; isId: boolean }) {
  if (status === "funded") return <Badge className="bg-emerald-600 text-white">{isId ? "Terdanai" : "Funded"}</Badge>;
  if (status === "open") return <Badge className="bg-primary text-primary-foreground">Open</Badge>;
  if (status === "due-diligence") return <Badge variant="secondary">Due Diligence</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}

export default function VillageInvestmentPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const [rows, setRows] = useState<InvestmentRow[]>(INITIAL_INVESTMENT_ROWS);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const totalTarget = rows.reduce((sum, row) => sum + row.target, 0);
  const totalCommitted = rows.reduce((sum, row) => sum + row.committed, 0);
  const progressPct = totalTarget === 0 ? 0 : Math.round((totalCommitted / totalTarget) * 100);
  const activeProjects = rows.filter((row) => row.status === "open" || row.status === "due-diligence").length;

  function addProjectDraft() {
    const idSuffix = String(Date.now()).slice(-6);
    const draft: InvestmentRow = {
      id: `inv-${idSuffix}`,
      project: isId ? "Proyek Experience Baru" : "New Experience Project",
      sector: "attraction",
      target: 500000000,
      committed: 0,
      investors: 0,
      expectedRoi: "10-12%",
      status: "draft",
    };
    setRows((prev) => [draft, ...prev]);
  }

  function openDetail(row: InvestmentRow) {
    setSelectedInvestment(row);
    setIsDetailOpen(true);
  }

  function updateFunding(row: InvestmentRow) {
    const additional = Math.max(Math.round(row.target * 0.05), 10000000);
    const nextCommitted = Math.min(row.target, row.committed + additional);
    const nextStatus: InvestmentStatus = nextCommitted >= row.target ? "funded" : row.status === "draft" ? "open" : row.status;
    const nextInvestors = nextCommitted > row.committed ? row.investors + 1 : row.investors;

    setRows((prev) =>
      prev.map((item) =>
        item.id === row.id
          ? {
              ...item,
              committed: nextCommitted,
              investors: nextInvestors,
              status: nextStatus,
            }
          : item,
      ),
    );

    setSelectedInvestment((prev) =>
      prev && prev.id === row.id
        ? {
            ...prev,
            committed: nextCommitted,
            investors: nextInvestors,
            status: nextStatus,
          }
        : prev,
    );
  }

  const columns = useMemo<ColumnDef<InvestmentRow>[]>(
    () => [
      {
        id: "project",
        header: isId ? "Proyek" : "Project",
        accessorFn: (row) => (
          <div className="space-y-0.5">
            <p className="font-medium text-on-surface">{row.project}</p>
            <p className="text-xs text-on-surface/60">ROI {row.expectedRoi}</p>
          </div>
        ),
        sortable: true,
      },
      {
        id: "sector",
        header: isId ? "Sektor" : "Sector",
        accessorKey: "sector",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "attraction", label: "Experience" },
          { value: "infrastructure", label: isId ? "Infrastruktur" : "Infrastructure" },
          { value: "hospitality", label: "Hospitality" },
          { value: "green-energy", label: isId ? "Energi Hijau" : "Green Energy" },
        ],
        accessorFn: (row) => getSectorLabel(row.sector, isId),
        hideOnMobile: true,
      },
      {
        id: "target",
        header: isId ? "Target Dana" : "Funding Target",
        accessorFn: (row) => formatCurrency(row.target, locale),
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "committed",
        header: isId ? "Komitmen" : "Committed",
        accessorFn: (row) => {
          const ratio = row.target === 0 ? 0 : Math.round((row.committed / row.target) * 100);
          return (
            <div className="space-y-1">
              <p className="text-xs font-medium text-on-surface">{formatCurrency(row.committed, locale)}</p>
              <div className="h-2 w-28 rounded-full bg-surface-container-high">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(ratio, 100)}%` }} />
              </div>
              <p className="text-[10px] text-on-surface/60">{ratio}%</p>
            </div>
          );
        },
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "draft", label: "Draft" },
          { value: "open", label: "Open" },
          { value: "due-diligence", label: "Due Diligence" },
          { value: "funded", label: isId ? "Terdanai" : "Funded" },
        ],
        accessorFn: (row) => <InvestmentStatusBadge status={row.status} isId={isId} />,
      },
    ],
    [isId, locale],
  );

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={isId ? "Investasi Desa" : "Village Investment"}
        description={
          isId
            ? "Publikasikan pipeline proyek desa, pantau progress pendanaan, dan dorong kolaborasi investor secara transparan."
            : "Publish village project pipelines, track funding progress, and drive transparent investor collaboration."
        }
        breadcrumbs={[
          { label: isId ? "Dashboard" : "Dashboard", href: "/dashboard/village-admin" },
          { label: isId ? "Investasi Desa" : "Village Investment" },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/village-admin/articles">{isId ? "Lihat Artikel" : "View Articles"}</Link>
            </Button>
            <Button size="sm" onClick={addProjectDraft}>
              {isId ? "Tambah Proyek" : "Add Project"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Target Pendanaan" : "Total Funding Target"}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">{formatCurrency(totalTarget, locale)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Komitmen" : "Total Committed"}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">{formatCurrency(totalCommitted, locale)}</p>
            <p className="text-xs text-on-surface/50">{progressPct}% {isId ? "tercapai" : "achieved"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Proyek Aktif" : "Active Projects"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{activeProjects}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Pipeline Investasi" : "Investment Pipeline"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["project"]}
            searchPlaceholder={isId ? "Cari proyek investasi..." : "Search investment projects..."}
            pageSize={10}
            actions={(row) => [
              {
                label: isId ? "Detail" : "Detail",
                onClick: () => openDetail(row),
              },
              {
                label: isId ? "Update Dana" : "Update Funding",
                onClick: () => updateFunding(row),
              },
            ]}
            mobileCardRenderer={(row) => (
              <div className="space-y-2">
                <p className="font-medium text-on-surface">{row.project}</p>
                <p className="text-xs text-on-surface/60">
                  {getSectorLabel(row.sector, isId)} · ROI {row.expectedRoi}
                </p>
                <div className="flex items-center justify-between">
                  <InvestmentStatusBadge status={row.status} isId={isId} />
                  <span className="text-xs text-on-surface/60">
                    {row.investors} {isId ? "investor" : "investors"}
                  </span>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInvestment?.project ?? (isId ? "Detail Proyek" : "Project Detail")}</DialogTitle>
            <DialogDescription>
              {selectedInvestment
                ? `${isId ? "Sektor" : "Sector"}: ${getSectorLabel(selectedInvestment.sector, isId)} · ROI ${selectedInvestment.expectedRoi}`
                : isId
                ? "Pilih proyek untuk melihat detail."
                : "Select a project to view detail."}
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment ? (
            <div className="space-y-3 text-sm text-on-surface/70">
              <div className="flex items-center gap-2">
                <span className="text-on-surface/50">Status:</span>
                <InvestmentStatusBadge status={selectedInvestment.status} isId={isId} />
              </div>
              <p>
                <span className="text-on-surface/50">{isId ? "Target" : "Target"}:</span>{" "}
                {formatCurrency(selectedInvestment.target, locale)}
              </p>
              <p>
                <span className="text-on-surface/50">{isId ? "Komitmen" : "Committed"}:</span>{" "}
                {formatCurrency(selectedInvestment.committed, locale)}
              </p>
              <p>
                <span className="text-on-surface/50">{isId ? "Investor" : "Investors"}:</span> {selectedInvestment.investors}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              {isId ? "Tutup" : "Close"}
            </Button>
            {selectedInvestment ? (
              <Button onClick={() => updateFunding(selectedInvestment)}>
                {isId ? "Update Dana" : "Update Funding"}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
