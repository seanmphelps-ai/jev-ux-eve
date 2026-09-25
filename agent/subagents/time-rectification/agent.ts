import { defineAgent } from "eve";

export default defineAgent({
  description: "Time rectification only. Does not invent a birth time.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
