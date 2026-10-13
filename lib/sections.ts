'use client';

import { useEffect, useState } from 'react';

export type Section = { id: string; label: string; offset?: number };

export const SECTIONS: Section[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'titanium', label: 'Titanium design', offset: 0.6 },
  { id: 'display', label: 'Display', offset: 0.5 },
  { id: 'sensor', label: 'BioActive Sensor', offset: 0.7 },
  { id: 'quick', label: 'Quick Button' },
  { id: 'health', label: 'Health' },
  { id: 'gps', label: 'Dual-frequency GPS' },
  { id: 'tough', label: 'Built tough' },
  { id: 'battery', label: 'Battery' },
  { id: 'colors', label: 'Colors' },
  { id: 'compare', label: 'vs Watch9' },
  { id: 'ecosystem', label: 'Galaxy ecosystem' },
  { id: 'specs', label: 'Specs' },
];

export function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.5;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return active;
}

export const sectionById = (id: string) => SECTIONS.find((s) => s.id === id);
