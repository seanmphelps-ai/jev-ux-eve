import { DEFAULT_QUESTIONS, localEvaluate, toRecord, type DecisionRecord, type Question } from "./policy";

const VERCEL_JEV_URL = "https://ai-gateway.vercel.sh/v1/evaluate";

export async function evaluateState(
  state: string,
  questions: Record<string, Question> = DEFAULT_QUESTIONS,
): Promise<DecisionRecord> {
  const started = Date.now();
  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;

  if (key) {
    try {
      const res = await fetch(VERCEL_JEV_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "typesafe-ai/jev",
          state,
          questions: toGatewayQuestions(questions),
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

function toGatewayQuestions(questions: Record<string, Question>) {
  const out: Record<string, unknown> = {};

  for (const [name, question] of Object.entries(questions)) {
    if (question.type === "noul" || question.type === "boolean") {
      out[name] = {
        type: "boolean",
        instructions: question.instructions,
      };
      continue;
    }

    if (question.type === "score") {
      out[name] = {
        type: "score",
        instructions: question.instructions,
        scale: question.scale,
      };
      continue;
    }

    out[name] = {
      type: "choice",
      instructions: question.instructions,
      criteria: question.criteria,
    };
  }

  return out;
}
