import EmergencyClient from "../../EmergencyClient";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function EmergencyPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  console.log("🔥 PAGE HIT:", id);

  const { data, error } = await supabase
    .from("emergency_profiles")
    .select("*")
    .eq("emergency_id", id)
    .maybeSingle();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (!data) {
    return <div>Emergency profile not found</div>;
  }

  return <EmergencyClient data={data} />;
}