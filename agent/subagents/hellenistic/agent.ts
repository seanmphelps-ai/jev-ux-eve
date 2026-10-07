import { defineAgent } from "eve";

export default defineAgent({
  description: "Hellenistic lineage only. Valens, Paulus, and Rhetorius stay separate.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
  tool: false,
});
