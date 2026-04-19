import { Badge } from "@/components/ui/badge";
import type { ProposalStatus, ProposalTimelineItem } from "@/features/shared/proposals/types";

const STATUS_LABEL: Record<ProposalStatus, { id: string; en: string; className: string }> = {
  submitted: { id: "Diajukan", en: "Submitted", className: "bg-blue-100 text-blue-800" },
  under_review: { id: "Direview", en: "Under Review", className: "bg-amber-100 text-amber-800" },
  changes_requested: { id: "Perlu Revisi", en: "Changes Requested", className: "bg-orange-100 text-orange-800" },
  approved: { id: "Disetujui", en: "Approved", className: "bg-emerald-100 text-emerald-800" },
  rejected: { id: "Ditolak", en: "Rejected", className: "bg-rose-100 text-rose-800" },
};

const TIMELINE_LABEL: Record<ProposalTimelineItem["key"], { id: string; en: string }> = {
  submitted: { id: "Diajukan", en: "Submitted" },
  under_review: { id: "Direview Desa", en: "Village Review" },
  approved: { id: "Disetujui", en: "Approved" },
};

export function ProposalStatusTracker({
  status,
  timeline,
  rejectionReason,
  isId,
}: {
  status: ProposalStatus;
  timeline: ProposalTimelineItem[];
  rejectionReason?: string;
  isId: boolean;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-stone-900">{isId ? "Progress Pengajuan" : "Submission Progress"}</p>
        <Badge className={STATUS_LABEL[status].className}>{isId ? STATUS_LABEL[status].id : STATUS_LABEL[status].en}</Badge>
      </div>

      <ol className="space-y-2">
        {timeline.map((point, index) => (
          <li key={`${point.key}-${index}`} className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
            <span>{isId ? TIMELINE_LABEL[point.key].id : TIMELINE_LABEL[point.key].en}</span>
            <span>{point.date}</span>
          </li>
        ))}
      </ol>

      {(status === "rejected" || status === "changes_requested") && rejectionReason ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <p className="font-semibold">{isId ? "Alasan dari Pengelola Desa" : "Message from Village Manager"}</p>
          <p className="mt-1">{rejectionReason}</p>
        </div>
      ) : null}
    </div>
  );
}
