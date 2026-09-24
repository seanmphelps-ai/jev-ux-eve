import { DEFAULT_QUESTIONS, localEvaluate, toRecord, type DecisionRecord, type Question } from "./policy";

export async function evaluateState(state: string, questions: Record<string, Question> = DEFAULT_QUESTIONS): Promise<DecisionRecord> {
  const started = Date.now();
  const key = process.env.AI_GATEWAY_API_KEY || process.env.TYPESAFE_API_KEY;
  const gateway = Boolean(process.env.AI_GATEWAY_API_KEY);

  if (key) {
    try {
      const url = gateway
        ? "https://ai-gateway.vercel.sh/v1/evaluate"
        : "https://api.typesafe.ai/v1/systemone";
      const body = gateway
        ? { model: "typesafe-ai/jev", state, questions: toGatewayQuestions(questions) }
        : { model: "jev-latest", state, questions: toTypeSafeQuestions(questions) };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Jev ${res.status}: ${text.slice(0, 240)}`);
      }
      const json = await res.json();
      const answers = json.answers ?? json;
      return toRecord(state, answers, "typesafe-ai/jev", Date.now() - started);
    } catch {
      return toRecord(state, localEvaluate(state, questions), "local-harness", Date.now() - started);
    }
  }

  await new Promise((r) => setTimeout(r, 80 + Math.floor(Math.random() * 140)));
  return toRecord(state, localEvaluate(state, questions), "local-harness", Date.now() - started);
}

function toGatewayQuestions(questions: Record<string, Question>) {
  const out: Record<string, unknown> = {};
  for (const [k, q] of Object.entries(questions)) {
    if (q.type === "noul") out[k] = { type: "boolean", instructions: q.instructions };
    else if (q.type === "choice") out[k] = { type: "choice", instructions: q.instructions, criteria: q.criteria };
    else if (q.type === "score") out[k] = { type: "score", instructions: q.instructions, scale: q.scale };
    else out[k] = q;
  }
  return out;
}

function toTypeSafeQuestions(questions: Record<string, Question>) {
  const out: Record<string, unknown> = {};
  for (const [k, q] of Object.entries(questions)) {
    out[k] = q;
  }
  return out;
}
