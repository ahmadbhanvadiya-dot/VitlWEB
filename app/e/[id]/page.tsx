import EmergencyClient from "../../EmergencyClient";
import { supabase } from "@/lib/supabase";

export default async function EmergencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("🔥 PAGE HIT:", id);

  const { data, error } = await supabase
    .from("emergency_profiles")
    .select("*")
    .eq("emergency_id", id)
    .maybeSingle();

  console.log("PARAM ID:", id);
  console.log("SUPABASE DATA:", data);
  console.log("SUPABASE ERROR:", error);

  if (error) {
    return <div>Database error: {error.message}</div>;
  }

  if (!data) {
    return <div>Emergency profile not found</div>;
  }

  return <EmergencyClient data={data} />;
}