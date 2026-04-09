import { redirect } from "next/navigation";

export default async function PropertyRoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/penginapan/kamar?accommodationId=${id}`);
}
