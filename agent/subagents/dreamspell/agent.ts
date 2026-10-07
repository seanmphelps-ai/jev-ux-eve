import { defineAgent } from "eve";

export default defineAgent({
  description: "Dreamspell lineage only. Not traditional Tzolk'in.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
