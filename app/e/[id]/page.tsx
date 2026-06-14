import EmergencyClient from "../../EmergencyClient";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function EmergencyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
console.log("EMERGENCY PAGE LOADED:", id);
console.log("ID:", id);
console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const { data, error } = await supabase
  .from("emergency_profiles")
  .select("*");

console.log("ID:", id);
console.log("DATA:", data);
console.log("ERROR:", error);
  if (error || !data) notFound();


  return <EmergencyClient data={data} />;
}