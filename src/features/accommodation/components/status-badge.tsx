import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SUBMISSION_STATUS_META } from "../constants";
import type { AccommodationSubmissionStatus } from "@/types";

export function SubmissionStatusBadge({
  status,
}: {
  status: AccommodationSubmissionStatus;
}) {
  const config = SUBMISSION_STATUS_META[status];

  return (
    <Badge className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
