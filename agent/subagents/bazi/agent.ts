import { defineAgent } from "eve";

export default defineAgent({
  description: "Bazi lineage only. Four pillars from a verified calculator. No other field.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
