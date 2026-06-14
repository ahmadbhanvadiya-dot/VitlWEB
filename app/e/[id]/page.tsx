"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { notFound } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EmergencyProfile {
  full_name: string;
  blood_group: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contacts?: { phone: string; priority: "primary" | "secondary" }[];
}

// ─── SOS Button ──────────────────────────────────────────────────────────────

function SOSButton({ profile }: { profile: EmergencyProfile }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const sendSOS = () => {
    setLoading(true);
    setStatus("idle");

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // Prefer structured emergency_contacts array; fall back to flat fields
        const primaryPhone =
          profile.emergency_contacts?.find((c) => c.priority === "primary")
            ?.phone ?? profile.emergency_contact_phone;

        if (!primaryPhone) {
          alert("No primary emergency contact phone number found.");
          setLoading(false);
          return;
        }

        const message =
          `🚨 SOS ALERT 🚨\n\n` +
          `${profile.full_name || "Someone"} may need immediate assistance.\n\n` +
          `📍 Current Location:\n${mapsLink}`;

        const smsUrl = `sms:${primaryPhone}?body=${encodeURIComponent(message)}`;
        window.location.href = smsUrl;

        setStatus("success");
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Failed to get your location. Please enable location access.");
        setStatus("error");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <button
        onClick={sendSOS}
        disabled={loading}
        className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg
                   hover:bg-red-700 active:scale-95 transition-all duration-150
                   disabled:opacity-60 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 shadow-md shadow-red-200"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Getting Location…
          </>
        ) : (
          "🚨 Send SOS with Location"
        )}
      </button>

      {status === "success" && (
        <p className="text-center text-sm text-green-600 font-medium">
          ✅ SOS message opened in your SMS app.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-500 font-medium">
          ❌ Could not get location. Check browser permissions.
        </p>
      )}
    </div>
  );
}

// ─── Info Card ───────────────────────────────────────────────────────────────

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: string;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-slate-800 font-medium leading-snug">
        {icon} {value || "None"}
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EmergencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("emergency_profiles")
        .select("*")
        .eq("emergency_id", id)
        .single();

      if (error || !data) {
        // Trigger Next.js 404
        notFound();
        return;
      }

      setProfile(data as EmergencyProfile);
      setLoading(false);
    }

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <span className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
          <p className="text-sm font-medium">Loading emergency profile…</p>
        </div>
      </main>
    );
  }

  if (!profile) return null;

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

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

function FieldRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
          {label}
        </p>
        <p
          className={`text-[13px] font-medium leading-snug ${
            value ? "text-slate-800" : "text-slate-300 italic"
          }`}
        >
          {value || "None recorded"}
        </p>
      </div>
    </div>
  );
}

function CrossIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h2l2-7 4 14 3-9 2 2h5" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.61 5.61l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.27 16l.65.92z" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
    </svg>
  );
}