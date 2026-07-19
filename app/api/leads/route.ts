import { NextResponse } from "next/server";

interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  source?: string;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: "Invalid content type. Expected application/json." }, { status: 400 });
    }
    let body: LeadPayload;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }
    const { name, phone, email, city, preferredDate, preferredTime, message, source } = body;

    // 1. Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Phone number must be exactly 10 digits." }, { status: 400 });
    }

    // 2. Retrieve credentials from Cloudflare Worker binding or Node process env dynamically
    let workersEnv: Record<string, string | undefined> = {};
    try {
      const workersMod = "cloudflare:workers";
      const mod = await import(/* @vite-ignore */ workersMod);
      workersEnv = mod.env as Record<string, string | undefined>;
  } catch {
    workersEnv = process.env as Record<string, string | undefined>;
  }

    const supabaseUrl = workersEnv.SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = workersEnv.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const googleSheetsUrl = workersEnv.GOOGLE_SHEETS_API_URL || process.env.GOOGLE_SHEETS_API_URL;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase configuration is missing.");
    }
    if (!googleSheetsUrl) {
      console.error("Google Sheets configuration is missing.");
    }

    if ((!supabaseUrl || !supabaseKey) && !googleSheetsUrl) {
      return NextResponse.json(
        { error: "Lead storage configuration is missing on the server." },
        { status: 500 }
      );
    }

    const storageResults: { supabase?: boolean; googleSheets?: boolean } = {};
    const errors: string[] = [];

    // 3. Define database insertions
    const insertSupabase = async () => {
      if (!supabaseUrl || !supabaseKey) return;
      
      const payload = {
        name: name.trim(),
        phone,
        email: email || null,
        city: city || null,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
        message: message || null,
        source: source || "Landing Page",
      };

      const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Supabase insertion failed:", errorText);
        throw new Error(`Supabase: ${response.statusText || errorText}`);
      }
      storageResults.supabase = true;
    };

    const insertGoogleSheets = async () => {
      if (!googleSheetsUrl) return;

      const payload = {
        name: name.trim(),
        phone,
        email: email || "",
        city: city || "",
        preferredDate: preferredDate || "",
        preferredTime: preferredTime || "",
        message: message || "",
        source: source || "Landing Page",
        createdAt: new Date().toISOString()
      };

      const response = await fetch(googleSheetsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Sheets insertion failed:", errorText);
        throw new Error(`Google Sheets: ${response.statusText || errorText}`);
      }
      storageResults.googleSheets = true;
    };

    // Run both insertions
    const promises = [];
    if (supabaseUrl && supabaseKey) {
      promises.push(
        insertSupabase().catch((err) => {
          errors.push(err.message);
        })
      );
    }
    if (googleSheetsUrl) {
      promises.push(
        insertGoogleSheets().catch((err) => {
          errors.push(err.message);
        })
      );
    }

    await Promise.all(promises);

    // If both failed, or if we had configurations but all attempted failed
    const attempts = promises.length;
    const failures = errors.length;

    if (attempts > 0 && failures === attempts) {
      return NextResponse.json(
        { error: `Failed to save lead: ${errors.join(" | ")}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      storage: storageResults,
      warnings: errors.length > 0 ? errors : undefined
    });

  } catch (error: unknown) {
    console.error("Error processing lead submission:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
