import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Time Rectification auditor. Separate from the reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
