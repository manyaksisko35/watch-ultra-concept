'use client';

import { useState } from 'react';
import { setStageNight } from '@/lib/stage';

function NightToggle() {
  const [night, setNight] = useState(false);
  const set = (v: boolean) => {
    setStageNight(v);
    setNight(v);
  };
  return (
    <div className="mt-6 lg:mt-8 inline-flex rounded-full border border-white/15 p-1 bg-black/40" role="radiogroup" aria-label="Display mode">
      {[
        { v: false, label: 'Day' },
        { v: true, label: 'Night mode' },
      ].map((o) => (
        <button
          key={o.label}
          role="radio"
          aria-checked={night === o.v}
          onClick={() => set(o.v)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            night === o.v ? (o.v ? 'bg-red-600 text-white' : 'bg-white text-black') : 'text-white/60 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const STATS = [
  { value: '5,000', unit: 'nits', label: 'peak brightness' },
  { value: '1.52', unit: '"', label: 'Super AMOLED' },
];

export default function StageSections() {
  return (
    <>
      <section id="titanium" className="relative h-[220svh]">
        <div className="sticky top-0 h-svh flex items-start lg:items-center px-6 lg:px-[8%] pt-24 lg:pt-0">
          <div className="max-w-md">
            <p className="sg-eyebrow mb-3 lg:mb-5">Design</p>
            <h2 className="sg-title">
              Titanium, <strong>slimmed down.</strong>
            </h2>
            <p className="sg-lead mt-4 lg:mt-6 max-lg:hidden">
              The Grade 4 titanium case is 1.4 mm thinner at 10.7 mm, the bezel is slimmer around a bigger display,
              and the reworked buttons are easier to find without looking.
            </p>
          </div>
        </div>
      </section>

      <section id="display" className="relative h-[220svh]">
        <div className="sticky top-0 h-svh flex items-start lg:items-center px-6 lg:px-[8%] pt-24 lg:pt-0">
          <div className="max-w-md">
            <p className="sg-eyebrow mb-3 lg:mb-5">Display</p>
            <h2 className="sg-title">
              Bright by day. <strong>Red by night.</strong>
            </h2>
            <p className="sg-lead mt-4 lg:mt-6 max-lg:hidden">
              A bigger 1.52&quot; screen reaches up to 5,000 nits, so the face stays readable in direct sun. After dark, Night Mode turns the screen red so it
              doesn&apos;t ruin your night vision, and it can switch on by itself in low light.
            </p>
            <div className="mt-6 hidden lg:flex gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-semibold tabular-nums">
                    {s.value}
                    <span className="text-base text-white/50"> {s.unit}</span>
                  </p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <NightToggle />
          </div>
        </div>
      </section>

      <section id="sensor" className="relative h-[220svh]">
        <div className="sticky top-0 h-svh flex items-start lg:items-center px-6 lg:px-[8%] pt-24 lg:pt-0">
          <div className="max-w-md">
            <p className="sg-eyebrow mb-3 lg:mb-5">BioActive Sensor</p>
            <h2 className="sg-title">
              One sensor. <strong>The whole picture.</strong>
            </h2>
            <p className="sg-lead mt-4 lg:mt-6 max-lg:hidden">
              Heart rate, ECG and body composition share one sensor under a ceramic and sapphire back, feeding your
              Energy Score, sleep insights and more.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
