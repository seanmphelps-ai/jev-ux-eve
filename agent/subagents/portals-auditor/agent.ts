import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Portals auditor. Separate from the Portals reader.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
