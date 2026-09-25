import { defineAgent } from "eve";

export default defineAgent({
  description: "Independent Forge UI auditor. Checks that the interface did not invent a reading.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
