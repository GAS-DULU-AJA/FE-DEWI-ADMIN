import { Badge } from "@/components/ui/badge";
import type { RoomStatus } from "@/types";

const ROOM_STATUS_META: Record<
  RoomStatus,
  { label: string; variant: "default" | "amber" | "red" }
> = {
  available: {
    label: "Tersedia",
    variant: "default",
  },
  booked: {
    label: "Penuh Dipesan",
    variant: "amber",
  },
  maintenance: {
    label: "Perawatan",
    variant: "red",
  },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const meta = ROOM_STATUS_META[status];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}