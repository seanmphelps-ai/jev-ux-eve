import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Hellenistic auditor. Separate from the Hellenistic reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
