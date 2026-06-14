import EmergencyClient from "../../EmergencyClient";
import { supabase } from "@/lib/supabase";

export default async function EmergencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;


  const { data, error } = await supabase
    .from("emergency_profiles")
    .select("*")
    .eq("emergency_id", id)
    .maybeSingle();



  if (error) {
    return <div>Database error: {error.message}</div>;
  }

  if (!data) {
    return (
  <div className="p-6 text-center">
    <h1>Emergency Profile Not Found</h1>
    <p>The QR code may be invalid or the profile may have been removed.</p>
  </div>
);
  }

  return <EmergencyClient data={data} />;
}