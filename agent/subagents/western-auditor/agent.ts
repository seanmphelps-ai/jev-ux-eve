import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Western auditor. Does not use the reader's inventory as proof.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
