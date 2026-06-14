export async function POST(req: Request) {
  try {
    const { data, language } = await req.json();

    // Convert structured emergency data into text
    const text = `
Name: ${data.full_name}
Blood Group: ${data.blood_group}
Allergies: ${data.allergies}
Medical Conditions: ${data.conditions}
Medications: ${data.medications}
Emergency Contact: ${data.emergency_contact_name} ${data.emergency_contact_phone}
`;

    // Call Sarvam AI
    const res = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        target_language: language,
      }),
    });

    const result = await res.json();

    return Response.json({
      translated: result.translated_text,
    });
  } catch (err: any) {
    return Response.json(
      { error: "Translation failed", details: err.message },
      { status: 500 }
    );
  }
}