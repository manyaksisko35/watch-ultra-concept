'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FACE_URL } from '@/lib/watchRig';

type Mode = 'face' | 'workout' | 'siren';

const HOLD_MS = 1400;

function useSiren() {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const start = () => {
    if (stopRef.current) return;
    const ctx = (ctxRef.current ??= new AudioContext());
    void ctx.resume();
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2600;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.05);
    for (let i = 0; i < 60; i++) {
      const t = now + i * 0.5;
      osc.frequency.setValueAtTime(i % 2 ? 1500 : 900, t);
      osc.frequency.linearRampToValueAtTime(i % 2 ? 900 : 1500, t + 0.5);
    }
    osc.connect(lp).connect(gain).connect(ctx.destination);
    osc.start();
    stopRef.current = () => {
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.08);
      osc.stop(t + 0.1);
      stopRef.current = null;
    };
  };
  const stop = () => stopRef.current?.();

  useEffect(
    () => () => {
      stopRef.current?.();
      void ctxRef.current?.close();
    },
    []
  );
  return { start, stop };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function QuickButtonSection() {
  const [mode, setMode] = useState<Mode>('face');
  const [elapsed, setElapsed] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef(0);
  const held = useRef(false);
  const siren = useSiren();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mode !== 'workout') return;
    const t0 = performance.now();
    const id = window.setInterval(() => setElapsed((performance.now() - t0) / 1000), 250);
    return () => window.clearInterval(id);
  }, [mode]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) {
        siren.stop();
        setMode((m) => (m === 'siren' ? 'face' : m));
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [siren]);

  const onDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    held.current = false;
    if (mode === 'siren') return;
    setHolding(true);
    holdTimer.current = window.setTimeout(() => {
      held.current = true;
      setHolding(false);
      setMode('siren');
      siren.start();
    }, HOLD_MS);
  };
  const onUp = () => {
    window.clearTimeout(holdTimer.current);
    setHolding(false);
    if (held.current) return;
    if (mode === 'siren') {
      siren.stop();
      setMode('face');
    } else if (mode === 'workout') {
      setMode('face');
    } else {
      setElapsed(0);
      setMode('workout');
    }
  };

  const secs = Math.floor(elapsed);
  const hr = Math.round(128 + Math.sin(elapsed * 0.7) * 9 + Math.min(20, elapsed * 0.8));
  const km = (elapsed * 0.0032).toFixed(2);

  return (
    <section ref={sectionRef} id="quick" className="sg-ambient amb-orange relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        <div>
          <p className="sg-eyebrow mb-3 lg:mb-5">Quick Button</p>
          <h2 className="sg-title">
            One button. <strong className="sg-ai">Go.</strong>
          </h2>
          <p className="sg-lead mt-4 lg:mt-6 max-w-md">
            Press the orange Quick Button to start a workout straight away. Press and hold it, and the watch sounds an
            emergency siren that carries up to 180 m.
          </p>
          <ul className="mt-8 grid gap-2 max-w-md text-sm">
            <li className="sg-card !rounded-2xl px-4 py-3 flex justify-between gap-4">
              <span className="font-semibold">Press</span>
              <span className="text-white/55">Start or stop a workout</span>
            </li>
            <li className="sg-card !rounded-2xl px-4 py-3 flex justify-between gap-4">
              <span className="font-semibold">Press and hold</span>
              <span className="text-white/55">Emergency siren (plays sound)</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-white/40 max-w-md">
            Illustration. The siren is quieter here than on the watch, which reaches up to 86 dB. Button actions can be
            customized.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-[min(78vw,360px)] aspect-square">
            <div className="absolute inset-0 rounded-[30%] bg-[linear-gradient(145deg,#4a4c52,#1c1d21_55%,#2c2e33)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)]" />
            <div className="absolute inset-[7%] rounded-full bg-[#121315] border border-white/10" />
            <div
              className={`absolute inset-[13%] rounded-full overflow-hidden bg-black transition-colors ${mode === 'siren' ? 'siren-flash' : ''}`}
              aria-live="polite"
            >
              {mode === 'face' && <Image src={FACE_URL} alt="Watch face" fill sizes="360px" className="object-cover" />}
              {mode === 'workout' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase">Running</p>
                  <p className="text-5xl font-semibold tabular-nums mt-1">
                    {pad(Math.floor(secs / 60))}:{pad(secs % 60)}
                  </p>
                  <div className="mt-3 flex gap-6 text-sm">
                    <span>
                      <span className="text-red-400">♥</span> <span className="tabular-nums">{hr}</span>
                      <span className="text-white/50 text-xs"> bpm</span>
                    </span>
                    <span>
                      <span className="tabular-nums">{km}</span>
                      <span className="text-white/50 text-xs"> km</span>
                    </span>
                  </div>
                  <p className="mt-4 text-[0.65rem] text-white/45">Press to end</p>
                </div>
              )}
              {mode === 'siren' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-bold">Emergency siren</p>
                  <p className="text-sm text-white/80 mt-1">Press the button to stop</p>
                </div>
              )}
            </div>
            <button
              aria-label="Quick Button. Press to start or stop a workout, press and hold for the emergency siren."
              onPointerDown={onDown}
              onPointerUp={onUp}
              onPointerCancel={() => {
                window.clearTimeout(holdTimer.current);
                setHolding(false);
              }}
              className="quick-btn absolute -right-[4%] top-1/2 -translate-y-1/2 w-[13%] aspect-square rounded-full touch-none"
            >
              <span className={`quick-btn__hold ${holding ? 'quick-btn__hold--on' : ''}`} style={{ ['--hold' as string]: `${HOLD_MS}ms` }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
