"use client";

import { useEffect, useRef, useState } from "react";

type RecordRow = {
  id: string;
  ts: number;
  state: string;
  action: string;
  verdict: string;
  confidence: number;
  route: string;
  risk: string;
  source: string;
  latencyMs: number;
};

const STAGES = ["TRACE", "STREAM", "ORIGIN", "SCORE", "BURST", "GUARD", "CAPTURE"];
const NODES = [
  { id: "intake", x: 0.18, y: 0.42 },
  { id: "western", x: 0.38, y: 0.22 },
  { id: "vedic", x: 0.38, y: 0.62 },
  { id: "wound", x: 0.55, y: 0.38 },
  { id: "jev", x: 0.72, y: 0.5 },
  { id: "eve", x: 0.88, y: 0.32 },
  { id: "host", x: 0.88, y: 0.68 },
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [4, 6], [1, 4], [2, 4],
];

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(89);
  const [last, setLast] = useState<RecordRow | null>(null);
  const [log, setLog] = useState<RecordRow[]>([]);
  const [live, setLive] = useState({ cycles: 242, nodes: 7, signals: 5641 });

  useEffect(() => {
    let stop = false;
    async function tick() {
      if (stop) return;
      try {
        const res = await fetch("/api/cycle");
        const json = await res.json();
        const rec = json.record as RecordRow;
        setLast(rec);
        setLog((prev) => [rec, ...prev].slice(0, 16));
        setScore(Math.round((rec.confidence ?? 0.8) * 100));
        setStage((s) => (s + 1) % STAGES.length);
        setLive((l) => ({ ...l, cycles: l.cycles + 1, signals: l.signals + 1 }));
      } catch {
        setStage((s) => (s + 1) % STAGES.length);
      }
    }
    tick();
    const id = window.setInterval(tick, 2400);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(5,8,14,0.28)";
      ctx.fillRect(0, 0, w, h);
      t += 1;
      const pulse = (stage + t * 0.02) % NODES.length;
      for (const [a, b] of EDGES) {
        const A = NODES[a];
        const B = NODES[b];
        ctx.strokeStyle = "rgba(110,231,255,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(A.x * w, A.y * h);
        ctx.lineTo(B.x * w, B.y * h);
        ctx.stroke();
        const u = (t * 0.012 + a * 0.1) % 1;
        ctx.fillStyle = "#6ee7ff";
        ctx.beginPath();
        ctx.arc(A.x * w + (B.x - A.x) * w * u, A.y * h + (B.y - A.y) * h * u, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      NODES.forEach((n, i) => {
        const on = Math.floor(pulse) === i || i === stage % NODES.length;
        ctx.fillStyle = on ? "#ff4fd8" : "#041018";
        ctx.strokeStyle = on ? "#6ee7ff" : "rgba(110,231,255,0.4)";
        ctx.lineWidth = on ? 2 : 1;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, on ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#9fb4d6";
        ctx.font = "10px ui-sans-serif";
        ctx.fillText(n.id.toUpperCase(), n.x * w + 12, n.y * h + 3);
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand">
          JEV ENGINEERING // EVE
          <b>THE DECISION LAYER</b>
        </div>
        <div className="stats">
          <div>cycles<strong>{live.cycles.toLocaleString()}</strong></div>
          <div>nodes<strong>{live.nodes}</strong></div>
          <div>signals<strong>{live.signals.toLocaleString()}</strong></div>
          <div>stage<strong>{STAGES[stage]}</strong></div>
        </div>
      </div>
      <div className="grid">
        <div className="panel">
          <h3>SEVEN STAGES</h3>
          <div className="stage-list">
            {STAGES.map((s, i) => (
              <div key={s} className={`stage ${i === stage ? "on" : ""}`}>
                <span>{s}</span>
                <span>{i === stage ? "LIVE" : "IDLE"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel viz">
          <canvas ref={canvasRef} className="ring" />
          <div className="hud">
            <div className="chip">TRACE<div className="spark" /></div>
            <div className="chip r">SCORE<div className="score">{score}</div></div>
            <div />
            <div />
            <div className="chip b">ORIGIN<div className="kvs">source <b>{last?.source ?? "local-harness"}</b></div></div>
            <div className="chip r b">GUARD<div className={`tag ${last?.verdict ?? "keep"}`}>{last?.verdict ?? "cycling"}</div></div>
          </div>
        </div>
        <div className="panel side">
          <h3>LIVE PACKET</h3>
          <p>{last?.state ?? "graph warming"}</p>
          <div className="kvs">
            <div>route <b>{last?.route ?? "fast"}</b></div>
            <div>risk <b>{last?.risk ?? "low"}</b></div>
            <div>latency <b>{last ? `${last.latencyMs}ms` : "—"}</b></div>
          </div>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 12 }}>
        <h3>DECISION STREAM</h3>
        <div className="log">
          {log.map((row) => (
            <div className="row" key={row.id}>
              <span className={`tag ${row.verdict}`}>{row.verdict}</span>
              <span>{row.route}</span>
              <span>{row.state.slice(0, 48)}</span>
              <span>{Math.round(row.confidence * 100)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
