import { defineAgent } from "eve";

export default defineAgent({
  description: "Vedic lineage only. Sidereal record from a verified calculator. No Western rules.",
  model: "openai/gpt-5.6-luna",
  defaultTools: false,
});
