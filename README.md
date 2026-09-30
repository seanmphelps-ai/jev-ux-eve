# JEV-UX · Eve on Vercel

Decision-layer console for TypeSafe Jev + Vercel Eve.

- UI: `/` dark ops console (TRACE / STREAM / ORIGIN / SCORE / BURST / GUARD / CAPTURE)
- API: `POST /api/evaluate` `{ "state": "cat /workspace/notes/release.md" }`
- API: `GET /api/cycle`
- Eve harness: `agent/` runs with this Next app at `/eve/v1/*`

Jev does not write text. It returns typed answers. Code owns the loop.

## Live path

1. This Next app and the Eve agent deploy together in one Vercel project.
2. Jev calls go through OpenRouter's Decisions API when `OPENROUTER_API_KEY` is set.
3. The evaluator sends `typesafe/jev-1.13` by default. Pinning this version keeps calibrated thresholds stable.
4. Without a key the local harness returns Choice / Score / Noul-shaped records so the console runs.

Eve uses the evaluator for its tool-call review. Its health route is `/eve/v1/health`.

## Deploy

```bash
npm i
npm run build
```

In the Vercel project, open **Settings → Environment Variables** and add:

```
OPENROUTER_API_KEY=sk-or-...
JEV_MODEL=typesafe/jev-1.13
```

Set both for Production, Preview, and Development, redeploy, then send:

```bash
curl -X POST https://YOUR-DEPLOYMENT/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"state":"Inspect the release notes and report whether a person must approve the next action."}'
```

A live response returns `"source":"typesafe-ai/jev"`. If it returns `"source":"local-harness"`, the OpenRouter key or Jev request failed.

## Eve agent (tool gate)

- `cat /workspace/notes/release.md` → Jev `clear` → Eve runs
- `rm /workspace/scratch.txt` → Jev `caution` → Eve pauses for a person

Model on the evaluator: `typesafe/jev-1.13` via OpenRouter. No separate TypeSafe or Vercel AI Gateway key is required.

## Sources

- OpenRouter Jev tutorial: https://openrouter.ai/docs/guides/community/jev-tutorial
- OpenRouter Jev model: https://openrouter.ai/~typesafe/jev-latest
- TypeSafe Jev: https://docs.typesafe.ai/introduction
- Vercel Eve: https://vercel.com/docs/eve
- Eve + Jev approvals: https://vercel.com/kb/guide/auto-approve-tool-calls-eve-jev
- LangChain harness: https://www.langchain.com/blog/building-a-harness-with-jev
