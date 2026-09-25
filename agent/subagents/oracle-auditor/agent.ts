import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Oracle auditor. Checks that speech did not calculate or invent a lineage.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
