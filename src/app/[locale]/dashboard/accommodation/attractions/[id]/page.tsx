import { redirect } from "next/navigation";

export default async function AccommodationAttractionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/accommodation/experiences/${id}`);
}
