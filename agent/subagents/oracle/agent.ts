import { defineAgent } from "eve";

export default defineAgent({
  description: "Oracle. Speaks only after stored lineage records and auditor results. Does not calculate.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
