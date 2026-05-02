import { redirect } from "next/navigation";

export default async function VillageAttractionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/village-admin/experiences/${id}`);
}
