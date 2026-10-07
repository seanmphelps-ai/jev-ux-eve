import { defineAgent } from "eve";

export default defineAgent({
  description: "Numerology lineage only. Named school reduction. No other field.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
