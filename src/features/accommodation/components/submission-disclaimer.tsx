import { AlertTriangle } from "lucide-react";
import { SUBMISSION_DISCLAIMER } from "../constants";

export function SubmissionDisclaimer() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700">
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
