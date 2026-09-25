import { defineAgent } from "eve";

export default defineAgent({
  description: "Forge UI only. Interface. Does not calculate or interpret a chart.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
