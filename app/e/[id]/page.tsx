import { supabase } from "../../lib/supabase";
import { notFound } from "next/navigation";

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
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <h1 className="text-2xl font-bold">
            🚑 Emergency Medical Profile
          </h1>
          <p className="text-red-100 mt-1">
            Access provided through VITL
          </p>
        </div>

        {/* Medical Warning */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
          <p className="text-sm text-amber-800">
            This information may be critical for emergency responders.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">
            {data.full_name || "Unknown Patient"}
          </h2>

          {/* Blood Group */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Blood Group</p>
            <p className="text-slate-900 font-medium text-lg">
              🩸 {data.blood_group || "Unknown"}
            </p>
          </div>

          {/* Allergies */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Allergies</p>
            <p className="text-slate-900">
              ⚠️ {data.allergies || "None"}
            </p>
          </div>

          {/* Medical Conditions */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Medical Conditions</p>
            <p className="text-slate-900">
              🩺 {data.conditions || "None"}
            </p>
          </div>

          {/* Medications */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Current Medications</p>
            <p className="text-slate-900">
              💊 {data.medications || "None"}
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-500">Emergency Contact</p>

            <p className="font-semibold text-slate-900">
              {data.emergency_contact_name || "Not Available"}
            </p>

            <p className="text-slate-500 text-sm mt-1">
              {data.emergency_contact_phone || "No phone number available"}
            </p>

            {data.emergency_contact_phone && (
              <a
                href={`tel:${data.emergency_contact_phone}`}
                className="mt-3 flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                📞 Call Emergency Contact
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pb-6 text-center text-xs text-slate-400">
          Powered by VITL Emergency Access
        </div>
      </div>
    </main>
  );
}