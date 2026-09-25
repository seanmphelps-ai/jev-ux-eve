import { defineWorkflowTool } from "eve/tools";
import { z } from "zod";

const auditor = {
  western: "western-auditor",
  vedic: "vedic-auditor",
  hellenistic: "hellenistic-auditor",
  numerology: "numerology-auditor",
  dreamspell: "dreamspell-auditor",
  bazi: "bazi-auditor",
  portals: "portals-auditor",
  "time-rectification": "time-rectification-auditor",
  oracle: "oracle-auditor",
  "forge-ui": "forge-ui-auditor",
} as const;

export default defineWorkflowTool({
  description:
    "Run exactly one lineage agent, then that lineage's auditor. Does not calculate. One lineage per call.",
  inputSchema: z.object({
    lineage: z.enum([
      "western",
      "vedic",
      "hellenistic",
      "numerology",
      "dreamspell",
      "bazi",
      "portals",
      "time-rectification",
      "oracle",
      "forge-ui",
    ]),
    record: z.string().min(1).max(100000),
  }),
  async execute({ lineage, record }, ctx) {
    "use workflow";
    const reading = await ctx.agent(lineage, { message: record });
    const audit = await ctx.agent(auditor[lineage], {
      message: typeof reading === "string" ? reading : JSON.stringify(reading),
    });
    return { lineage, reading, audit };
  },
});
