# Photo_scanner
Created via Acode

## Gemini without pasting a key (Cloudflare Worker)
1. Go to dash.cloudflare.com -> Workers & Pages -> Create -> Create Worker -> Deploy, then **Edit code**.
2. Paste the content of `worker.js`, then Deploy.
3. Worker -> Settings -> Variables and Secrets -> add a **Secret** named `GEMINI_API_KEY` with your key.
4. Copy the Worker URL (https://NAME.SUBDOMAIN.workers.dev) and put it in `GEMINI_PROXY` in `index.html`.
