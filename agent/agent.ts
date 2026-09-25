import { defineAgent } from "eve";

export default defineAgent({
  description: "Chief of Staff. One dispatch call runs one lineage, then its auditor.",
  model: "openai/gpt-5.6-luna",
  modelContextWindowTokens: 1_000_000,
  defaultTools: false,
  tool: false,
});
