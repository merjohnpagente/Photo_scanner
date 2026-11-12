// Cloudflare Worker: holds the Gemini key as a SECRET so the web page never needs it.
// Deploy steps are in the README. Set the secret GEMINI_API_KEY in the Worker's Settings -> Variables.
const ALLOWED_ORIGINS = [
  "https://merjohnpagente.github.io",
  "http://127.0.0.1:5000",
  "http://localhost:5000",
];
const MODEL = "gemini-flash-latest";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const ok = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": ok ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (!ok || request.method !== "POST") return new Response("Not allowed", { status: 403, headers: cors });
    if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: { message: "GEMINI_API_KEY is not set in the Worker." } }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    const body = await request.text();
    if (body.length > 8_000_000) return new Response("Too large", { status: 413, headers: cors });
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body,
    });
    return new Response(res.body, { status: res.status, headers: { ...cors, "Content-Type": "application/json" } });
  },
};
