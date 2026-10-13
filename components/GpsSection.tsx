'use client';

import { useCallback, useRef, useState } from 'react';
import { useCanvasLoop } from '@/lib/useCanvasLoop';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { getBand } from '@/lib/theme';

const COLS = 6;
const ROWS = 4;
const STREET = 0.028;

const ROUTE: [number, number][] = [
  [0, 1],
  [0, 3],
  [2, 3],
  [2, 2],
  [4, 2],
  [4, 0],
  [6, 0],
  [6, 4],
];

const TALL = new Set(['1-1', '1-2', '2-1', '3-1', '3-2', '4-2']);

type Pt = { x: number; y: number; nx: number; ny: number; s: number };

function sampleRoute(w: number, h: number, m: number) {
  const cell = { w: (w - m * 2) / COLS, h: (h - m * 2) / ROWS };
  const P = ROUTE.map(([c, r]) => ({ x: m + c * cell.w, y: m + r * cell.h }));
  const pts: Pt[] = [];
  let s = 0;
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i];
    const b = P[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
    const steps = Math.ceil(len / 3);
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, nx, ny, s: s + len * t });
    }
    s += len;
  }
  const last = P[P.length - 1];
  pts.push({ x: last.x, y: last.y, nx: 0, ny: 0, s });
  return { pts, cell, total: s };
}

function tallness(x: number, y: number, m: number, cell: { w: number; h: number }) {
  const c = Math.floor((x - m) / cell.w);
  const r = Math.floor((y - m) / cell.h);
  let k = 0;
  for (const [dc, dr] of [
    [0, 0],
    [-1, 0],
    [0, -1],
    [-1, -1],
  ]) {
    if (TALL.has(`${c + dc}-${r + dr}`)) k += 0.25;
  }
  return k;
}

export default function GpsSection() {
  const [dual, setDual] = useState(true);
  const reduce = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const m = Math.min(w, h) * 0.06;
      const { pts, cell, total } = sampleRoute(w, h, m);
      const st = Math.min(w, h) * STREET;

      ctx.fillStyle = '#0b0c0e';
      ctx.fillRect(0, 0, w, h);
      for (let c = -1; c <= COLS; c++) {
        for (let r = -1; r <= ROWS; r++) {
          const tall = TALL.has(`${c}-${r}`);
          ctx.fillStyle = tall ? '#24262b' : '#17181b';
          const x = m + c * cell.w + st;
          const y = m + r * cell.h + st;
          ctx.beginPath();
          ctx.roundRect(x, y, cell.w - st * 2, cell.h - st * 2, 6);
          ctx.fill();
          if (tall) {
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            for (let i = 1; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(x + 6, y + ((cell.h - st * 2) * i) / 4);
              ctx.lineTo(x + cell.w - st * 2 - 6, y + ((cell.h - st * 2) * i) / 4);
              ctx.stroke();
            }
          }
        }
      }

      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      ctx.setLineDash([]);

      const u = reduce ? 1 : ((t * 0.07) % 1.15) / 1.0;
      const upto = Math.min(1, u) * total;
      const amp = Math.min(w, h) * (dual ? 0.006 : 0.05);
      ctx.strokeStyle = dual ? getBand().accent[1] : '#f43f5e';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      let hx = pts[0].x;
      let hy = pts[0].y;
      for (let i = 0; i < pts.length && pts[i].s <= upto; i++) {
        const p = pts[i];
        const k = dual ? 0.6 : 0.15 + tallness(p.x, p.y, m, cell) * 1.3;
        const e = (Math.sin(p.s * 0.031) + 0.6 * Math.sin(p.s * 0.083 + 1.7) + 0.3 * Math.sin(p.s * 0.19)) * amp * k;
        const ex = p.x + p.nx * e + (dual ? 0 : Math.sin(p.s * 0.05) * amp * k * 0.4);
        const ey = p.y + p.ny * e;
        if (i === 0) ctx.moveTo(ex, ey);
        else ctx.lineTo(ex, ey);
        hx = ex;
        hy = ey;
      }
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = dual ? `${getBand().accent[1]}80` : 'rgba(244,63,94,0.5)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(hx, hy, 11, 0, Math.PI * 2);
      ctx.stroke();
    },
    [dual, reduce]
  );
  useCanvasLoop(canvas, draw, !reduce);

  return (
    <section id="gps" className="sg-ambient amb-night relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-16 items-center">
        <div>
          <p className="sg-eyebrow mb-3 lg:mb-5">Dual-frequency GPS</p>
          <h2 className="sg-title">
            Stays on track <strong className="sg-ai">between towers.</strong>
          </h2>
          <p className="sg-lead mt-4 lg:mt-6 max-w-md">
            Tall buildings bounce satellite signals and pull a single-band track off course. Listening on both L1 and L5
            bands lets the watch tell the real signal from the echo.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-white/15 p-1 bg-black/40" role="radiogroup" aria-label="GPS bands">
            {[
              { v: false, label: 'L1 only' },
              { v: true, label: 'L1 + L5' },
            ].map((o) => (
              <button
                key={o.label}
                role="radio"
                aria-checked={dual === o.v}
                onClick={() => setDual(o.v)}
                className={`rounded-full px-5 py-2 text-sm transition-colors ${dual === o.v ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-6 text-xs text-white/55">
            <span className="flex items-center gap-2">
              <i className="w-5 border-t-2 border-dashed border-white/40" /> Actual route
            </span>
            <span className="flex items-center gap-2">
              <i className={`w-5 h-[3px] rounded ${dual ? 'bg-[var(--a2)]' : 'bg-rose-500'}`} /> Recorded track
            </span>
          </div>
        </div>
        <div className="sg-card !rounded-3xl overflow-hidden p-0">
          <canvas ref={canvas} className="block w-full aspect-[3/2]" aria-label={dual ? 'Dual-band track follows the route closely' : 'Single-band track drifts near tall buildings'} role="img" />
        </div>
      </div>
      <p className="max-w-7xl mx-auto mt-6 text-xs text-white/40">Simulation for illustration. Real accuracy depends on surroundings and conditions.</p>
    </section>
  );
}
