import { NextRequest, NextResponse } from "next/server";
import { evaluateState } from "@/lib/jev";
import { DEFAULT_QUESTIONS } from "@/lib/policy";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const state = String(body.state ?? "").slice(0, 8000);
  if (!state.trim()) {
    return NextResponse.json({ error: "state required" }, { status: 400 });
  }
  const questions = body.questions && typeof body.questions === "object" ? body.questions : DEFAULT_QUESTIONS;
  const record = await evaluateState(state, questions);
  return NextResponse.json(record);
}
