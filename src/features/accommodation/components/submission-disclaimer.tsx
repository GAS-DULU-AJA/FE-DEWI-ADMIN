import { AlertTriangle } from "lucide-react";
import { SUBMISSION_DISCLAIMER } from "../constants";

export function SubmissionDisclaimer() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Pemberitahuan Penting</p>
          <p className="mt-1 text-sm leading-relaxed">{SUBMISSION_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
}
