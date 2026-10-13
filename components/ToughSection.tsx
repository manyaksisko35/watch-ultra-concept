'use client';

import { useState } from 'react';

const TABS = [
  {
    id: 'water',
    label: 'Water',
    value: '100',
    unit: 'm',
    title: '10ATM and IP68',
    text: 'Rated for water pressure equal to 100 m, for swimming, snorkeling and water sports at the surface.',
    bg: 'radial-gradient(80% 70% at 50% 100%, rgba(14,165,233,0.35), transparent 70%)',
  },
  {
    id: 'altitude',
    label: 'Altitude',
    value: '9,000',
    unit: 'm',
    title: 'From -500 m to 9,000 m',
    text: 'The barometer keeps working from below sea level to the height of the tallest peaks.',
    bg: 'radial-gradient(80% 70% at 50% 0%, rgba(186,230,253,0.28), transparent 70%)',
  },
  {
    id: 'temp',
    label: 'Temperature',
    value: '-20 to 55',
    unit: '°C',
    title: 'Desert heat to winter cold',
    text: 'Designed to work from freezing mountain mornings to scorching afternoons.',
    bg: 'linear-gradient(90deg, rgba(56,189,248,0.22), transparent 40%, transparent 60%, rgba(249,115,22,0.3))',
  },
  {
    id: 'shock',
    label: 'Durability',
    value: 'MIL-STD',
    unit: '810H',
    title: 'Tested to a military standard',
    text: 'Tested against drops, shocks and other harsh conditions to the MIL-STD-810H standard.',
    bg: 'radial-gradient(70% 60% at 50% 50%, rgba(255,106,18,0.25), transparent 70%)',
  },
] as const;

export default function ToughSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('water');
  const cur = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <section id="tough" className="relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="max-w-6xl mx-auto text-center">
        <p className="sg-eyebrow mb-3 lg:mb-5">Built tough</p>
        <h2 className="sg-title">
          Wherever you go, <strong className="sg-ai">it goes.</strong>
        </h2>
        <div className="mt-8 lg:mt-10 inline-flex flex-wrap justify-center rounded-full border border-white/15 p-1 bg-black/40" role="tablist" aria-label="Conditions">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="tough-panel"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 lg:px-5 py-2 text-sm transition-colors ${tab === t.id ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div
          id="tough-panel"
          role="tabpanel"
          aria-labelledby={`tab-${cur.id}`}
          className="relative mt-8 lg:mt-10 sg-card !rounded-[32px] overflow-hidden px-6 py-14 lg:py-20"
        >
          <div key={cur.id} className="tough-bg absolute inset-0 -z-0" style={{ background: cur.bg }} aria-hidden />
          <div key={`${cur.id}-v`} className="tough-in relative">
            <p className="text-[18vw] sm:text-[7rem] lg:text-[9rem] font-semibold leading-none tracking-tight tabular-nums">
              {cur.value}
              <span className="text-[0.3em] text-white/55 font-normal ml-2">{cur.unit}</span>
            </p>
            <p className="mt-6 text-xl lg:text-2xl font-semibold">{cur.title}</p>
            <p className="sg-lead mt-2 max-w-lg mx-auto">{cur.text}</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-white/40 max-w-3xl mx-auto">
          10ATM: not for scuba diving or high-velocity water. IP68: up to 1.5 m of fresh water for up to 30 minutes.
          Passing MIL-STD-810H tests does not guarantee durability in every condition.
        </p>
      </div>
    </section>
  );
}
