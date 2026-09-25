import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Numerology auditor. Separate from the Numerology reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
