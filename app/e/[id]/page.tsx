import EmergencyClient from "../../EmergencyClient";
import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";

export default async function EmergencyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const { data, error } = await supabase
    .from("emergency_profiles")
    .select("*")
    .eq("emergency_id", id)
    .single();

  if (error || !data) notFound();

  return <EmergencyClient data={data} />;
}