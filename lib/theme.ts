'use client';

import { useSyncExternalStore } from 'react';

export type Band = {
  id: string;
  name: string;
  color: number;
  swatch: string;
  accent: [string, string, string];
};

export const BANDS: Band[] = [
  { id: 'black', name: 'Black', color: 0x34373c, swatch: '#3b3e43', accent: ['#eef0f2', '#aab1ba', '#6f7782'] },
  { id: 'olive', name: 'Olive Green', color: 0x48523f, swatch: '#5f6a55', accent: ['#e0e9d3', '#a4b98c', '#6d8259'] },
  { id: 'mocha', name: 'Mocha', color: 0xd3cab9, swatch: '#b8b09f', accent: ['#f4ecdd', '#d4c1a1', '#a48c68'] },
  { id: 'orange', name: 'Orange', color: 0xf26a26, swatch: '#f26b2b', accent: ['#ffc58f', '#ff7a1f', '#ff4d2e'] },
  { id: 'blue', name: 'Blue', color: 0x9cc3e5, swatch: '#93bce0', accent: ['#dcefff', '#8fc5f2', '#4b8fd1'] },
];

export const DEFAULT_BAND = BANDS[1];
const KEY = 'ultra2-band';

let current = DEFAULT_BAND;
const listeners = new Set<() => void>();

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

function paint(b: Band) {
  const s = document.documentElement.style;
  s.setProperty('--a1', b.accent[0]);
  s.setProperty('--a2', b.accent[1]);
  s.setProperty('--a3', b.accent[2]);
  s.setProperty('--a-rgb', rgb(b.accent[1]));
}

export function setBand(id: string, save = true) {
  const b = BANDS.find((x) => x.id === id);
  if (!b) return;
  current = b;
  paint(b);
  if (save) {
    try {
      localStorage.setItem(KEY, id);
    } catch {}
  }
  listeners.forEach((l) => l());
}

export function restoreBand() {
  try {
    const id = localStorage.getItem(KEY);
    if (id && id !== current.id) setBand(id, false);
  } catch {}
}

export const getBand = () => current;

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useBand() {
  return useSyncExternalStore(subscribe, getBand, () => DEFAULT_BAND);
}
