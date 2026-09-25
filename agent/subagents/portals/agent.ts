import { defineAgent } from "eve";

export default defineAgent({
  description: "Portals only. Does not calculate a chart.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
