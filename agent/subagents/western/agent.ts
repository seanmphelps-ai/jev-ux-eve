import { defineAgent } from "eve";

export default defineAgent({
  description: "Western lineage only. Native tropical positions from a verified calculator. No other field.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
