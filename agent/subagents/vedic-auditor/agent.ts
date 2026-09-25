import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Vedic auditor. Separate from the Vedic reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
