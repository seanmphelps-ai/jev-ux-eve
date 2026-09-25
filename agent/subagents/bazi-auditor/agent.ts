import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Bazi auditor. Separate from the Bazi reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
