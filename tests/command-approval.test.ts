import { Experimental_EvaluationMockModelV4 as MockEvaluationModel } from "ai/test";
import type { ApprovalContext } from "eve/tools/approval";
import { describe, expect, it } from "vitest";

import { commandApproval } from "../agent/lib/command-approval";

const context: ApprovalContext = {
  toolName: "bash",
  toolInput: { command: "cat /workspace/notes/release.md" },
  callId: "test-call",
  approvedTools: new Set<string>(),
  abortSignal: new AbortController().signal,
  session: {
    id: "test-session",
    auth: { current: null, initiator: null },
    turn: { id: "test-turn", sequence: 1 },
  },
  async getSandbox() {
    throw new Error("This approval test must not access a sandbox.");
  },
  getSkill() {
    throw new Error("This approval test must not load a skill.");
  },
};

describe("command approval", () => {
  it.each([
    ["clear", "approved"],
    ["caution", "user-approval"],
  ] as const)("maps %s to %s", async (choice, expected) => {
    const model = new MockEvaluationModel({
      doEvaluate: async () => ({
        answers: { permission: { type: "choice", choice } },
        warnings: [],
      }),
    });

    expect(await commandApproval(model)(context)).toBe(expected);
  });

  it("requires a person when the evaluator fails", async () => {
    const model = new MockEvaluationModel({
      doEvaluate: async () => {
        throw new Error("Evaluator unavailable");
      },
    });

    expect(await commandApproval(model)(context)).toBe("user-approval");
  });
});
