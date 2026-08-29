import { redirect } from "next/navigation";

export default async function LegacyPipelineDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  if (params?.id) {
    redirect(`/pipeline/${params.id}`);
  } else {
    redirect("/pipeline");
  }
}
