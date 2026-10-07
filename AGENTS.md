# AGENTS.md — SEEN Runtime

Universal instructions for every generator working in this repo.
Claude, Codex, Cursor, Copilot, Eve, Jev — all of you read this file.
It replaces CLAUDE.md. One spine, one runtime, one schema per section.

## What this repo is

A decision-layer console. Jev evaluates proposed actions and returns typed
answers (Choice / Score / Noul). Eve is the agent harness that runs tools
behind Jev's gate. The console visualizes the pipeline.

## The rule

One runtime. Twelve sections. No sprawl.

Every modality — western, vedic, hellenistic, bazi, numerology, dreamspell,
and the rest — translates through the same schema. No separate codebases
per modality. No duplicate branches. No four hundred files.

## The twelve sections

Each section is one schema, not one folder of files.

1. **Intake** — raw input: birth data, location, time, source material
2. **Western** — tropical zodiac, houses, aspects, dignities
3. **Vedic** — sidereal zodiac, nakshatras, dashas, yogas
4. **Hellenistic** — whole sign houses, sect, lots, time lords
5. **Bazi** — four pillars, elements, stems and branches
6. **Numerology** — life path, expression, personal year
7. **Dreamspell** — thirteen moons, galactic signature, tone
8. **Wound** — Chiron, Lilith, the dark chart, rectification
9. **Jev** — the decision layer: typed questions, verdicts, routes
10. **Eve** — the agent harness: tools, sandbox, approvals
11. **Host** — the human: what gets shown, what gets decided
12. **Capture** — output: records, logs, the decision stream

## How to work

- Read this file before touching anything.
- One section at a time. Finish it before starting the next.
- If a file doesn't map to one of these twelve sections, it doesn't belong.
- If two branches do the same thing, keep the one that fits the schema.
- Generators write code. The schema owns the structure.

## What not to do

- Do not create new top-level folders for each modality.
- Do not duplicate the runtime spine across branches.
- Do not add files that only one generator understands.
- Do not let the repo grow past what these twelve sections need.
