export type ProposalModule = "UMKM" | "EXPERIENCE" | "ACCOMMODATION";

export type ProposalStatus =
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected";

export type ProposalTimelineItem = {
  key: "submitted" | "under_review" | "approved";
  date: string;
};

export type ProposalPreviewSection = {
  titleId: string;
  titleEn: string;
  rows: Array<{
    labelId: string;
    labelEn: string;
    value: string;
  }>;
};

export type UnifiedProposal = {
  id: string;
  module: ProposalModule;
  fromRole: "UMKM" | "EVENT_ORGANIZER" | "ACCOMMODATION";
  title: string;
  targetVillage: string;
  submittedAt: string;
  status: ProposalStatus;
  rejectionReason?: string;
  timeline: ProposalTimelineItem[];
  sections: ProposalPreviewSection[];
};
