import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // 60s timeout for vision AI processing
export const runtime = "nodejs"; // Ensure route runs on Node.js runtime

interface GeminiDishItem {
  name: string;
  price?: number | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  is_veg: boolean;
  confidence: number;
  reason: string;
  swap: string;
}

interface GeminiAnalysisResponse {
  is_menu: boolean;
  blur_or_unclear_reason?: string;
  restaurant_name?: string;
  dishes: GeminiDishItem[];
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify API Key from environment (.env.local / Vercel Env) - never sent to frontend
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please add your GEMINI_API_KEY to your environment variables to enable live menu OCR.",
          code: "MISSING_API_KEY",
        },
        { status: 401 }
      );
    }

    // 2. Parse Image from FormData or JSON
    let base64Data = "";
    let mimeType = "image/jpeg";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file =
        (formData.get("file") as File | null) ||
        (formData.get("image") as File | null);

      if (!file) {
        return NextResponse.json(
          { error: "No image file provided in request.", code: "NO_FILE" },
          { status: 400 }
        );
      }

      // Check file size (max 4.5MB serverless limit safeguard)
      if (file.size > 4.5 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: "Uploaded image is too large (max 4MB allowed).",
            code: "PAYLOAD_TOO_LARGE",
          },
          { status: 413 }
        );
      }

      mimeType = file.type || "image/jpeg";
      const buffer = await file.arrayBuffer();
      base64Data = Buffer.from(buffer).toString("base64");
    } else {
      const json = await req.json();
      if (!json.imageBase64) {
        return NextResponse.json(
          { error: "Missing imageBase64 in request body.", code: "NO_FILE" },
          { status: 400 }
        );
      }
      base64Data = json.imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      if (json.mimeType) mimeType = json.mimeType;
    }

    if (!base64Data || base64Data.length < 50) {
      return NextResponse.json(
        { error: "Invalid image data received.", code: "INVALID_IMAGE" },
        { status: 400 }
      );
    }

    // 3. Construct Gemini Prompt with strict JSON Schema
    const systemPrompt = `You are an expert Indian clinical nutritionist and menu OCR system. Analyze this restaurant menu photo. The menu may be written in English, Hindi (Devanagari), Hinglish, or bilingual.

CRITICAL BLURRY / UNCLEAR CHECK:
First inspect the image clarity. If the image is:
1. Too blurry, out of focus, or low resolution to decipher dish names and words with certainty, OR
2. Completely dark, overexposed by flash/glare, or unreadable, OR
3. Not a restaurant menu or food dish list (e.g. photo of a person, object, random scene),
THEN you MUST set "is_menu": false, provide a friendly reason in "blur_or_unclear_reason" (e.g. "The camera photo is too blurry to read the text", "The lighting is too dim or glare covers the text", or "No restaurant menu detected"), and return "dishes": [].

IF THE MENU IS LEGIBLE:
Set "is_menu": true.
Extract the restaurant name if printed on top, otherwise "Scanned Restaurant Menu".
Extract up to 15 distinct dishes visible on the menu across categories (Starters, Tandoor, Curries, Dals, Breads, Rice).
For EACH dish:
- name: Dish name in English. If in Hindi Devanagari script, provide the English romanization followed by Hindi in brackets e.g. "Paneer Tikka (पनीर टिक्का)"
- price: Number in INR if visible (e.g. 280), otherwise null
- calories: Realistic serving calories in kcal
- protein: Estimated protein in grams
- carbs: Estimated carbohydrates in grams
- fat: Estimated total fat in grams
- sugar: Estimated sugar in grams
- sodium: Estimated sodium in milligrams
- is_veg: true if purely vegetarian (dairy/paneer allowed; strictly NO egg, chicken, fish, mutton), false if non-vegetarian or contains egg
- confidence: OCR confidence between 0.1 and 1.0
- reason: Clinical nutrition verdict: why this dish has this health score, highlighting hidden cooking oils, gravies, refined flour, or lean protein benefits
- swap: Practical healthier swap or ordering modification with calorie savings`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.1,
        response_schema: {
          type: "OBJECT",
          properties: {
            is_menu: {
              type: "BOOLEAN",
              description:
                "True if readable food menu, false if blurry, dark, unreadable or not a menu",
            },
            blur_or_unclear_reason: {
              type: "STRING",
              description:
                "Friendly reason if photo is blurry, unreadable, or not a menu",
            },
            restaurant_name: {
              type: "STRING",
              description: "Restaurant name if visible on menu",
            },
            dishes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  price: { type: "NUMBER" },
                  calories: { type: "NUMBER" },
                  protein: { type: "NUMBER" },
                  carbs: { type: "NUMBER" },
                  fat: { type: "NUMBER" },
                  sugar: { type: "NUMBER" },
                  sodium: { type: "NUMBER" },
                  is_veg: { type: "BOOLEAN" },
                  confidence: { type: "NUMBER" },
                  reason: { type: "STRING" },
                  swap: { type: "STRING" },
                },
                required: [
                  "name",
                  "calories",
                  "protein",
                  "carbs",
                  "fat",
                  "sugar",
                  "sodium",
                  "is_veg",
                  "confidence",
                  "reason",
                  "swap",
                ],
              },
            },
          },
          required: ["is_menu", "dishes"],
        },
      },
    };

    // 4. Send request to Gemini API (try active working models in sequence)
    const models = [
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-3.8-flash",
      "gemini-2.5-pro",
      "gemini-1.5-flash",
    ];
    let geminiResponse: Response | null = null;
    let selectedModel = models[0];

    for (const model of models) {
      selectedModel = model;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        // If success, break and use it
        if (res.ok) {
          geminiResponse = res;
          break;
        }

        // If 404 (model not found for this key) or 503, try next model
        if (res.status === 404 || res.status === 503) {
          continue;
        }

        // If bad request/quota/forbidden, stop and report
        geminiResponse = res;
        break;
      } catch (e) {
        console.warn(`Model ${model} fetch failed, trying next...`, e);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      const errText = geminiResponse
        ? await geminiResponse.text()
        : "No response from Gemini API";
      console.error("Gemini API Error:", errText);

      // Check for rate limit / quota
      if (geminiResponse?.status === 429) {
        return NextResponse.json(
          {
            error:
              "Gemini AI rate limit or quota exceeded. Please wait a moment and try again.",
            code: "RATE_LIMITED",
            details: errText,
          },
          { status: 429 }
        );
      }

      // Check for timeout
      if (geminiResponse?.status === 504 || geminiResponse?.status === 408) {
        return NextResponse.json(
          {
            error: "Gemini AI processing timed out. Please try again.",
            code: "TIMEOUT",
            details: errText,
          },
          { status: 504 }
        );
      }

      // Check for invalid key or permission
      if (geminiResponse?.status === 400 || geminiResponse?.status === 403) {
        return NextResponse.json(
          {
            error:
              "Gemini API rejected request. Please check that your GEMINI_API_KEY is valid and active.",
            code: "INVALID_API_KEY",
            details: errText,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Failed to process menu photo with Gemini Vision. Please try again.",
          code: "GEMINI_ERROR",
          details: errText,
        },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        {
          error: "No response text generated by Gemini.",
          code: "EMPTY_RESPONSE",
        },
        { status: 500 }
      );
    }

    // 5. Parse JSON strictly
    let parsed: GeminiAnalysisResponse;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON parse error from Gemini text:", rawText);
      return NextResponse.json(
        {
          error: "Gemini returned non-JSON text. Please retry.",
          code: "PARSE_ERROR",
        },
        { status: 500 }
      );
    }

    // 6. Handle Blurry / Unclear photo detection
    if (!parsed.is_menu || !parsed.dishes || parsed.dishes.length === 0) {
      return NextResponse.json(
        {
          error:
            parsed.blur_or_unclear_reason ||
            "The photo appears too blurry or unclear to read menu dishes. Please retake the photo with steady hands and clear lighting.",
          code: "BLURRY_OR_UNCLEAR",
          details: parsed.blur_or_unclear_reason,
        },
        { status: 422 }
      );
    }

    // 7. Success: Return ONLY valid JSON with the exact requested fields
    return NextResponse.json({
      success: true,
      restaurant_name: parsed.restaurant_name || "Scanned Menu",
      model_used: selectedModel,
      dishes: parsed.dishes.map((d) => ({
        name: d.name,
        price: d.price ?? null,
        calories: Number(d.calories) || 250,
        protein: Number(d.protein) || 10,
        carbs: Number(d.carbs) || 25,
        fat: Number(d.fat) || 12,
        sugar: Number(d.sugar) || 2,
        sodium: Number(d.sodium) || 500,
        is_veg: Boolean(d.is_veg),
        confidence: Number(d.confidence) || 0.9,
        reason: d.reason || "Analyzed from menu preparation style",
        swap: d.swap || "Opt for less oil and whole-wheat roti",
      })),
    });
  } catch (err: any) {
    console.error("API /api/analyze exception:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "An unexpected error occurred while analyzing the menu.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
