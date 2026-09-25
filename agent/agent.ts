import { defineAgent } from "eve";

export default defineAgent({
  description: "Chief of Staff. Queues one lineage at a time, then its auditor. Does not calculate or audit.",
  model: "openai/gpt-5.6-luna",
  modelContextWindowTokens: 1_000_000,
  defaultTools: false,
});
