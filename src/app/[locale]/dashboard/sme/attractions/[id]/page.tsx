import { redirect } from "next/navigation";

export default async function SmeAttractionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/sme/experiences/${id}`);
}
