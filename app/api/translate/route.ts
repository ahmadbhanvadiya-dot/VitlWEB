import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data, language } = await req.json();

    const fields = {
  // Patient Data
  full_name: data.full_name || "",
  allergies: data.allergies || "",
  conditions: data.conditions || "",
  medications: data.medications || "",
  emergency_contact_name: data.emergency_contact_name || "",

  // UI Labels
  ui_patient_name: "Patient Name",
  ui_blood_type: "Blood Type",
  ui_critical_information: "Critical Information",
  ui_allergies: "Allergies",
  ui_conditions: "Medical Conditions",
  ui_medications: "Current Medications",
  ui_emergency_contact: "Emergency Contact",
  ui_call: "Call",
};

    const translatedFields: Record<string, string> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        translatedFields[key] = "";
        continue;
      }

      try {
        const response = await fetch(
          "https://api.sarvam.ai/translate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-subscription-key":
                process.env.SARVAM_API_KEY || "",
            },
            body: JSON.stringify({
              input: value,
              source_language_code: "en-IN",
              target_language_code: language,
            }),
          }
        );

        const result = await response.json();

        console.log(`Translated ${key}:`, result);

        translatedFields[key] =
          result.translated_text || value;
      } catch (error) {
        console.error(
          `Failed translating ${key}:`,
          error
        );

        translatedFields[key] = value;
      }
    }

    return NextResponse.json({
      translated: translatedFields,
    });
  } catch (err: any) {
    console.error("Translation Error:", err);

    return NextResponse.json(
      {
        error: "Translation failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}