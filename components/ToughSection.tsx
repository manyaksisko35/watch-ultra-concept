'use client';

import { useState } from 'react';

const TABS = [
  {
    id: 'water',
    label: 'Water',
    value: '10',
    unit: 'ATM',
    title: 'Rated to 10ATM',
    text: 'Water pressure equal to 100 m, for swimming, snorkeling and water sports at the surface.',
    bg: 'radial-gradient(80% 70% at 50% 100%, rgba(14,165,233,0.35), transparent 70%)',
  },
  {
    id: 'dive',
    label: 'Dive',
    value: '40',
    unit: 'm',
    title: 'Ready for recreational diving',
    text: 'Swimproof to the EN13319 standard, with a Depth app that shows your depth, water temperature and dive time.',
    bg: 'radial-gradient(90% 80% at 50% 110%, rgba(30,64,175,0.55), transparent 70%)',
  },
  {
    id: 'dust',
    label: 'Dust and jets',
    value: 'IP69K',
    unit: '',
    title: 'Sealed against dust and jets',
    text: 'The top dust rating, plus protection against high-pressure, high-temperature water jets.',
    bg: 'radial-gradient(70% 60% at 50% 40%, rgba(234,179,8,0.22), transparent 70%)',
  },
  {
    id: 'build',
    label: 'Materials',
    value: 'Grade 4',
    unit: 'titanium',
    title: 'Titanium, sapphire, ceramic',
    text: 'A titanium case, a sapphire crystal on top and a ceramic and sapphire back.',
    bg: 'radial-gradient(70% 60% at 50% 50%, rgb(var(--a-rgb) / 0.25), transparent 70%)',
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
          Ratings per Samsung and launch coverage. Diving use is limited to the stated standard and depth; follow
          Samsung&apos;s guidance before using the watch underwater.
        </p>
      </div>
    </section>
  );
}
