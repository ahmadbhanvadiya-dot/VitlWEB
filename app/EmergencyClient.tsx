"use client";

import { useState } from "react";

export default function EmergencyClient({ data }: any) {
  const [language, setLanguage] = useState("hi");
  const [translated, setTranslated] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (language === "original") {
  setTranslated(null);
  return;
}

  async function handleTranslate() {
    setLoading(true);

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data,
        language,
      }),
    });

    const result = await res.json();

console.log("TRANSLATION RESULT:", result);

if (result.error) {
  alert(result.error);
  return;
}

setTranslated(result.translated);
  }

  const display = translated
  ? {
      ...data,
      ...translated,
    }
  : data;

  const initials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F7FAF8] px-4 py-5 font-sans">

      {/* 🌐 TRANSLATION CONTROLS */}
      <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
        
        <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="
    bg-white
    border
    border-slate-300
    text-slate-700
    font-medium
    px-4
    py-2
    rounded-lg
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-green-600
  "
>
  <option value="original">Original Language</option>

  <option value="en-IN">English</option>
  <option value="hi-IN">Hindi</option>
  <option value="bn-IN">Bengali</option>
  <option value="te-IN">Telugu</option>
  <option value="mr-IN">Marathi</option>
  <option value="ta-IN">Tamil</option>
  <option value="ur-IN">Urdu</option>
  <option value="gu-IN">Gujarati</option>
  <option value="kn-IN">Kannada</option>
  <option value="ml-IN">Malayalam</option>
  <option value="pa-IN">Punjabi</option>
  <option value="or-IN">Odia</option>
  <option value="as-IN">Assamese</option>
</select>

        <button
          onClick={handleTranslate}
          className="bg-green-700 text-white px-4 py-2 rounded-md text-sm"
        >
          {loading ? "Translating..." : "Translate 🌐"}
        </button>
      </div>

{/* TRANSLATED TEXT PREVIEW */}
{translated && (
  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 max-w-lg mx-auto">
    <h3 className="font-semibold text-slate-800 mb-2">
      Translated Information
    </h3>

    <pre className="whitespace-pre-wrap text-sm text-slate-700">
      {translated}
    </pre>
  </div>
)}

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#166634] rounded-md flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 12h8M12 8v8M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#166634] tracking-tight">
            VITL Health
          </span>
        </div>

        <span className="text-[11px] font-medium text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 leading-none">
          Emergency Access
        </span>
      </div>

      {/* PATIENT BLOCK */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between mb-3 max-w-lg mx-auto">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Patient
          </p>
          <p className="text-[20px] font-semibold text-slate-900 leading-tight">
            {display.full_name || "Unknown Patient"}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center flex-shrink-0 ml-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
            Blood type
          </p>
          <p className="text-[22px] font-bold text-red-600 leading-none">
            {display.blood_group || "—"}
          </p>
        </div>
      </div>

      {/* CRITICAL INFORMATION */}
      <p className="text-[12px] font-bold uppercase tracking-widest text-slate-600 mb-2 px-1 max-w-lg mx-auto">
        Critical information
      </p>

      <div className="flex flex-col gap-2 mb-3 max-w-lg mx-auto">
        <FieldRow icon={<CrossIcon />} label="Allergies" value={display.allergies} />
        <FieldRow icon={<HeartIcon />} label="Medical conditions" value={display.conditions} />
        <FieldRow icon={<PillIcon />} label="Current medications" value={display.medications} />
      </div>

      {/* EMERGENCY CONTACT */}
      <p className="text-[12px] font-bold uppercase tracking-widest text-slate-600 mb-2 px-1 max-w-lg mx-auto">
        Emergency contact
      </p>

      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5 max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-[12px] font-semibold text-[#166634] flex-shrink-0">
              {display.emergency_contact_name
                ? initials(display.emergency_contact_name)
                : "—"}
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-slate-800 truncate">
                {display.emergency_contact_name || "Not available"}
              </p>
              <p className="text-[12px] text-slate-400">
                Emergency contact
              </p>
            </div>
          </div>

          {display.emergency_contact_phone && (
            <a
              href={`tel:${display.emergency_contact_phone}`}
              className="flex items-center gap-1.5 bg-[#166634] text-white text-[14px] font-semibold rounded-lg px-4 py-2.5 flex-shrink-0 active:opacity-80"
            >
              <PhoneIcon />
              Call
            </a>
          )}
        </div>

        {display.emergency_contact_phone && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[14px] text-slate-500">
            <MobileIcon />
            {display.emergency_contact_phone}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <p className="text-center text-[10px] text-slate-300 tracking-wide max-w-lg mx-auto">
        Powered by VITL Emergency Access
      </p>
    </main>
  );
}

/* ================= COMPONENTS ================= */

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
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
      <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-1">
          {label}
        </p>

        <p className={`text-[15px] font-medium leading-snug ${
          value ? "text-slate-800" : "text-slate-300 italic"
        }`}>
          {value || "None recorded"}
        </p>
      </div>
    </div>
  );
}

/* ICONS */

function CrossIcon() {
  return (
    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h2l2-7 4 14 3-9 2 2h5" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
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
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}