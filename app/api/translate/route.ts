import { NextResponse } from "next/server";

const languageMap: Record<string, string> = {
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
};

export async function POST(req: Request) {
  try {
    const { data, language } = await req.json();

    const text = `
Name: ${data.full_name || ""}
Blood Group: ${data.blood_group || ""}
Allergies: ${data.allergies || ""}
Medical Conditions: ${data.conditions || ""}
Medications: ${data.medications || ""}
Emergency Contact: ${data.emergency_contact_name || ""} ${data.emergency_contact_phone || ""}
`;

    const response = await fetch(
      "https://api.sarvam.ai/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // IMPORTANT:
          // Sarvam docs use api-subscription-key
          "api-subscription-key":
            process.env.SARVAM_API_KEY || "",
        },
        body: JSON.stringify({
          input: text,
          source_language_code: "en-IN",
          target_language_code:
            languageMap[language] || "hi-IN",
        }),
      }
    );

    const result = await response.json();

    console.log("SARVAM RESULT:", result);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Sarvam request failed",
          details: result,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      translated: result.translated_text,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Translation failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}