import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data, language } = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "Missing profile data" },
        { status: 400 }
      );
    }

    const text = `
Name: ${data.full_name || ""}
Blood Group: ${data.blood_group || ""}
Allergies: ${data.allergies || ""}
Medical Conditions: ${data.conditions || ""}
Medications: ${data.medications || ""}
Emergency Contact: ${data.emergency_contact_name || ""} ${data.emergency_contact_phone || ""}
`;

    console.log("TRANSLATING TO:", language);
    console.log("TEXT:", text);

    const response = await fetch(
      "https://api.sarvam.ai/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          target_language: language,
        }),
      }
    );

    const rawText = await response.text();

    console.log("SARVAM STATUS:", response.status);
    console.log("SARVAM RAW RESPONSE:", rawText);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Sarvam request failed",
          status: response.status,
          details: rawText,
        },
        { status: 500 }
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON returned by Sarvam",
          details: rawText,
        },
        { status: 500 }
      );
    }

    console.log("SARVAM PARSED:", parsed);

    return NextResponse.json({
      translated: parsed,
    });
  } catch (err: any) {
    console.error("TRANSLATE ROUTE ERROR:", err);

    return NextResponse.json(
      {
        error: "Translation failed",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}