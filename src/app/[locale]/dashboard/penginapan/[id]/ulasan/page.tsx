import { redirect } from "next/navigation";

export default async function PropertyReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/penginapan/ulasan?accommodationId=${id}`);
}
