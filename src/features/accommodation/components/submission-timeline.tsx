import { formatDateShort } from "@/lib/utils";
import { SubmissionStatusBadge } from "./status-badge";
import type { AccommodationSubmissionEvent } from "@/types";

export function SubmissionTimeline({
  events,
}: {
  events: AccommodationSubmissionEvent[];
}) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-surface-container-high p-4 text-sm text-on-surface/60">
        Belum ada riwayat pengajuan.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-ambient"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-on-surface">{event.title}</p>
            <SubmissionStatusBadge status={event.status} />
          </div>
          <p className="mt-1 text-sm text-on-surface/70">{event.description}</p>
          {event.rejectionDetails && event.rejectionDetails.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-700">
              {event.rejectionDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
          <p className="mt-2 text-xs text-on-surface/40">
            {formatDateShort(event.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
