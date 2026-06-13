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

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-red-600 text-white px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            🚑 Emergency Medical Profile
          </h1>
          <p className="text-red-200 text-sm mt-1">Access provided through VITL</p>
        </div>

        {/* ── Warning Banner ── */}
        <div className="bg-amber-50 border-l-4 border-amber-500 px-4 py-3">
          <p className="text-xs text-amber-800 font-medium">
            ⚠️ This information may be critical for emergency responders.
            Handle with care.
          </p>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-4">

          {/* Patient Name */}
          <h2 className="text-2xl font-bold text-slate-900">
            {profile.full_name || "Unknown Patient"}
          </h2>

          {/* Medical Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Blood Group" value={profile.blood_group} icon="🩸" />
            <InfoCard label="Allergies"   value={profile.allergies}   icon="⚠️" />
          </div>

          <InfoCard label="Medical Conditions"  value={profile.conditions}  icon="🩺" />
          <InfoCard label="Current Medications" value={profile.medications} icon="💊" />

          {/* Emergency Contact */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Emergency Contact
            </p>

            <div>
              <p className="font-semibold text-slate-900 text-base">
                {profile.emergency_contact_name || "Not Available"}
              </p>
              <p className="text-slate-500 text-sm mt-0.5">
                {profile.emergency_contact_phone || "No phone number available"}
              </p>
            </div>

            {profile.emergency_contact_phone && (
              <a
                href={`tel:${profile.emergency_contact_phone}`}
                className="flex items-center justify-center gap-2 w-full bg-green-600
                           text-white py-3 rounded-xl font-semibold text-sm
                           hover:bg-green-700 active:scale-95 transition-all duration-150"
              >
                📞 Call Emergency Contact
              </a>
            )}
          </div>

          {/* SOS Button */}
          <SOSButton profile={profile} />
        </div>

        {/* ── Footer ── */}
        <div className="pb-5 text-center text-xs text-slate-400">
          Powered by VITL Emergency Access
        </div>
      </div>
    </main>
  );
}