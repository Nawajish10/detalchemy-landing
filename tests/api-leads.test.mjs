import assert from "node:assert/strict";
import test from "node:test";

test("API leads route validations and success flow", async () => {
  // Set fake environment variables for test execution
  process.env.SUPABASE_URL = "https://test-project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "test-anon-key";
  process.env.GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/test-script/exec";

  // Mock global fetch to capture outgoing API calls to Supabase and Google Sheets
  const originalFetch = globalThis.fetch;
  const calls = [];
  
  globalThis.fetch = async (input, init) => {
    const url = input.toString();
    const method = init?.method || "GET";
    const body = init?.body ? JSON.parse(init.body.toString()) : null;
    calls.push({ url, method, body });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  try {
    // Test case 1: Missing name
    const res1 = await worker.fetch(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "9606948060",
          message: "Test message"
        })
      }),
      {},
      { waitUntil() {}, passThroughOnException() {} }
    );
    assert.equal(res1.status, 400);
    const data1 = await res1.json();
    assert.equal(data1.error, "Name is required.");

    // Test case 2: Invalid phone
    const res2 = await worker.fetch(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Afreen",
          phone: "12345",
          message: "Test message"
        })
      }),
      {},
      { waitUntil() {}, passThroughOnException() {} }
    );
    assert.equal(res2.status, 400);
    const data2 = await res2.json();
    assert.equal(data2.error, "Phone number must be exactly 10 digits.");

    // Test case 3: Success submission triggers both Supabase and Google Sheets calls
    const res3 = await worker.fetch(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          phone: "9876543210",
          email: "test@example.com",
          city: "Bangalore",
          preferredDate: "2026-07-20",
          preferredTime: "10:00 AM",
          message: "Root Canal Treatment",
          source: "Landing Page Chatbot"
        })
      }),
      {},
      { waitUntil() {}, passThroughOnException() {} }
    );
    
    assert.equal(res3.status, 200);
    const data3 = await res3.json();
    assert.equal(data3.success, true);
    assert.equal(data3.storage.supabase, true);
    assert.equal(data3.storage.googleSheets, true);

    // Verify calls made
    assert.equal(calls.length, 2);
    
    const supabaseCall = calls.find(c => c.url.includes("supabase.co"));
    assert.ok(supabaseCall);
    assert.equal(supabaseCall.method, "POST");
    assert.equal(supabaseCall.body.name, "Test User");
    assert.equal(supabaseCall.body.phone, "9876543210");
    assert.equal(supabaseCall.body.email, "test@example.com");
    assert.equal(supabaseCall.body.city, "Bangalore");
    assert.equal(supabaseCall.body.preferred_date, "2026-07-20");
    assert.equal(supabaseCall.body.preferred_time, "10:00 AM");
    assert.equal(supabaseCall.body.message, "Root Canal Treatment");
    assert.equal(supabaseCall.body.source, "Landing Page Chatbot");

    const sheetsCall = calls.find(c => c.url.includes("script.google.com"));
    assert.ok(sheetsCall);
    assert.equal(sheetsCall.method, "POST");
    assert.equal(sheetsCall.body.name, "Test User");
    assert.equal(sheetsCall.body.phone, "9876543210");
    assert.equal(sheetsCall.body.email, "test@example.com");
    assert.equal(sheetsCall.body.city, "Bangalore");
    assert.equal(sheetsCall.body.preferredDate, "2026-07-20");
    assert.equal(sheetsCall.body.preferredTime, "10:00 AM");
    assert.equal(sheetsCall.body.message, "Root Canal Treatment");
    assert.equal(sheetsCall.body.source, "Landing Page Chatbot");

  } finally {
    globalThis.fetch = originalFetch;
  }
});
