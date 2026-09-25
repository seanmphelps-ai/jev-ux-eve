# JEV-UX · Eve on Vercel

Decision-layer console for TypeSafe Jev + Vercel Eve.

- UI: `/` dark ops console (TRACE / STREAM / ORIGIN / SCORE / BURST / GUARD / CAPTURE)
- API: `POST /api/evaluate` `{ "state": "cat /workspace/notes/release.md" }`
- API: `GET /api/cycle`
- Eve harness: `agent/` runs with this Next app at `/eve/v1/*`

Jev does not write text. It returns typed answers. Code owns the loop.

## Live path

1. This Next app and the Eve agent deploy together in one Vercel project.
2. Jev calls go through Vercel AI Gateway when `AI_GATEWAY_API_KEY` is set (`model: typesafe-ai/jev`).
3. Without a key the local harness still returns Choice / Score / Noul-shaped records so the console runs.

Eve uses the Vercel project's AI Gateway connection for its tool-call review. Its health route is `/eve/v1/health`.

## Deploy

```bash
npm i
npm run build
```

Vercel project env (optional, for live Jev):

```
AI_GATEWAY_API_KEY=...
```

Or TypeSafe direct:

```
TYPESAFE_API_KEY=...
```

## Eve agent (tool gate)

From https://vercel.com/kb/guide/auto-approve-tool-calls-eve-jev

- `cat /workspace/notes/release.md` → Jev `clear` → Eve runs
- `rm /workspace/scratch.txt` → Jev `caution` → Eve pauses for a person

Model on the evaluator: `typesafe-ai/jev` via AI Gateway. No separate TypeSafe key required on Vercel.

## Sources

- TypeSafe Jev: https://docs.typesafe.ai/introduction
- Vercel Eve: https://vercel.com/docs/eve
- Eve + Jev approvals: https://vercel.com/kb/guide/auto-approve-tool-calls-eve-jev
- AI Gateway Jev: https://vercel.com/changelog/ai-gateway-now-supports-typesafe-clients-and-http-api-for-jev
- LangChain harness: https://www.langchain.com/blog/building-a-harness-with-jev
