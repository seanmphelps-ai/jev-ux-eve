import { DEFAULT_QUESTIONS, localEvaluate, toRecord, type DecisionRecord, type Question } from "./policy";

const OPENROUTER_DECISIONS_URL = "https://openrouter.ai/api/alpha/decisions";
const DEFAULT_JEV_MODEL = "typesafe/jev-1.13";

export async function evaluateState(
  state: string,
  questions: Record<string, Question> = DEFAULT_QUESTIONS,
): Promise<DecisionRecord> {
  const started = Date.now();
  const key = process.env.OPENROUTER_API_KEY;

  if (key) {
    try {
      const res = await fetch(OPENROUTER_DECISIONS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.JEV_MODEL ?? DEFAULT_JEV_MODEL,
          state,
          questions: toOpenRouterQuestions(questions),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Jev ${res.status}: ${text.slice(0, 240)}`);
      }

      const json = await res.json();
      return toRecord(
        state,
        json.answers ?? json,
        "typesafe-ai/jev",
        Date.now() - started,
      );
    } catch {
      return toRecord(
        state,
        localEvaluate(state, questions),
        "local-harness",
        Date.now() - started,
      );
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 80 + Math.floor(Math.random() * 140)));
  return toRecord(
    state,
    localEvaluate(state, questions),
    "local-harness",
    Date.now() - started,
  );
}

function toOpenRouterQuestions(questions: Record<string, Question>) {
  const out: Record<string, unknown> = {};

  for (const [name, question] of Object.entries(questions)) {
    if (question.type === "score") {
      out[name] = {
        type: "score",
        instructions: question.instructions,
        criteria: question.scale,
      };
      continue;
    }

    out[name] = {
      type: question.type === "boolean" ? "noul" : question.type,
      instructions: question.instructions,
      ...(question.criteria ? { criteria: question.criteria } : {}),
    };
  }

  return out;
}
