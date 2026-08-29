import { redirect } from "next/navigation";

export default async function SOWRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ dealId?: string }>;
}) {
  const params = await searchParams;
  const dealId = params?.dealId;
  if (dealId) {
    redirect(`/pipeline/${dealId}/sow`);
  } else {
    redirect("/pipeline/sow");
  }
}
