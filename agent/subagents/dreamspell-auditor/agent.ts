import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Dreamspell auditor. Separate from the Dreamspell reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
