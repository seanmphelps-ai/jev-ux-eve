export type QuestionType = "choice" | "score" | "noul" | "boolean";

export type Question = {
  type: QuestionType;
  instructions: string;
  criteria?: Record<string, string>;
  scale?: string[];
};

export type DecisionRecord = {
  id: string;
  ts: number;
  state: string;
  action: string;
  verdict: "keep" | "select" | "inspect" | "escalate" | "deny" | "fallback";
  confidence: number;
  route: "fast" | "balanced" | "strong" | "human";
  risk: "low" | "medium" | "high";
  answers: Record<string, unknown>;
  source: "typesafe-ai/jev" | "local-harness";
  latencyMs: number;
};

const DESTRUCTIVE =
  /\b(rm|rmdir|drop|delete|truncate|chmod|chown|curl|wget|ssh|scp|sudo|mkfs|dd|kill|reboot)\b/i;
const WRITE = /\b(mv|cp|touch|echo|sed|awk|npm i|git push|git reset|write|patch)\b/i;
const READ = /\b(ls|cat|head|tail|pwd|whoami|date|find|grep|stat|file)\b/i;

export function localEvaluate(state: string, questions: Record<string, Question>) {
  const text = state.toLowerCase();
  const answers: Record<string, unknown> = {};

  for (const [name, q] of Object.entries(questions)) {
    if (q.type === "noul" || q.type === "boolean") {
      let p = 0.18;
      if (DESTRUCTIVE.test(text)) p = 0.92;
      else if (/urgent|asap|prod|outage|500|down/.test(text)) p = 0.81;
      else if (WRITE.test(text)) p = 0.54;
      else if (READ.test(text)) p = 0.12;
      answers[name] = { type: q.type, probability: p, noul: p };
    } else if (q.type === "score") {
      const scale = q.scale ?? ["Low", "Medium", "High", "Critical"];
      let idx = 0;
      if (DESTRUCTIVE.test(text) || /critical|outage/.test(text)) idx = scale.length - 1;
      else if (WRITE.test(text) || /urgent/.test(text)) idx = Math.min(2, scale.length - 1);
      else if (/medium|moderate/.test(text)) idx = Math.min(1, scale.length - 1);
      const dist = scale.map((_, i) => (i === idx ? 0.72 : 0.28 / Math.max(1, scale.length - 1)));
      answers[name] = { type: "score", score: scale[idx], distribution: Object.fromEntries(scale.map((s, i) => [s, dist[i]])) };
    } else {
      const keys = Object.keys(q.criteria ?? { keep: "safe", inspect: "review", deny: "block" });
      let pick = keys[0];
      if (DESTRUCTIVE.test(text) && keys.includes("deny")) pick = "deny";
      else if (DESTRUCTIVE.test(text) && keys.includes("caution")) pick = "caution";
      else if (WRITE.test(text) && keys.includes("inspect")) pick = "inspect";
      else if (WRITE.test(text) && keys.includes("caution")) pick = "caution";
      else if (keys.includes("clear") && READ.test(text)) pick = "clear";
      else if (keys.includes("keep") && READ.test(text)) pick = "keep";
      else if (keys.includes("fast") && text.length < 80) pick = "fast";
      else if (keys.includes("strong") && /architect|redesign|migrate/.test(text)) pick = "strong";
      const dist: Record<string, number> = {};
      keys.forEach((k) => (dist[k] = k === pick ? 0.78 : 0.22 / Math.max(1, keys.length - 1)));
      answers[name] = { type: "choice", choice: pick, confidence: dist[pick], distribution: dist };
    }
  }
  return answers;
}

export function toRecord(state: string, answers: Record<string, unknown>, source: DecisionRecord["source"], latencyMs: number): DecisionRecord {
  const text = state.toLowerCase();
  const destructive = DESTRUCTIVE.test(text);
  const write = WRITE.test(text);
  const first = Object.values(answers)[0] as any;
  const confidence =
    typeof first?.confidence === "number"
      ? first.confidence
      : typeof first?.probability === "number"
        ? first.probability
        : typeof first?.noul === "number"
          ? first.noul
          : 0.7;

  let verdict: DecisionRecord["verdict"] = "keep";
  if (destructive) verdict = confidence > 0.7 ? "deny" : "escalate";
  else if (write) verdict = "inspect";
  else if (/complex|architect|migrate/.test(text)) verdict = "select";
  else if (confidence < 0.55) verdict = "fallback";

  const route: DecisionRecord["route"] =
    verdict === "escalate" || verdict === "deny" ? "human" : /architect|migrate|outage/.test(text) ? "strong" : write ? "balanced" : "fast";

  return {
    id: `dec-${Date.now().toString(36)}`,
    ts: Date.now(),
    state,
    action: first?.choice ?? first?.score ?? (confidence > 0.7 ? "yes" : "no"),
    verdict,
    confidence: Number(confidence.toFixed(3)),
    route,
    risk: destructive ? "high" : write ? "medium" : "low",
    answers,
    source,
    latencyMs,
  };
}

export const DEFAULT_QUESTIONS: Record<string, Question> = {
  disposition: {
    type: "choice",
    instructions: "What should the host do with this proposed action?",
    criteria: {
      keep: "Stay on the current user route. Safe read or inspection.",
      select: "Route to a stronger model. Needs reasoning.",
      inspect: "Re-check before execution. Side effects possible.",
      escalate: "Human must approve. Irreversible or high blast radius.",
      deny: "Block. Destructive, credential, or network risk.",
      fallback: "Abstain. Confidence too low or state incomplete.",
    },
  },
  approval: {
    type: "choice",
    instructions: "Eve tool-call gate. clear runs. caution pauses for a person.",
    criteria: {
      clear: "Inspects ordinary files. No writes, credentials, or network.",
      caution: "Changes files, credentials, network, or effects are unclear.",
    },
  },
  severity: {
    type: "score",
    instructions: "How severe is the blast radius if this runs?",
    scale: ["Low", "Medium", "High", "Critical"],
  },
  needs_human: {
    type: "noul",
    instructions: "Does a human need to look at this before it leaves the terminal?",
  },
};
