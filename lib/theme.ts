'use client';

import { useSyncExternalStore } from 'react';

export type BandKind = 'sport' | 'leather';

export type Band = {
  id: string;
  kind: BandKind;
  name: string;
  color: number;
  swatch: string;
  accent: [string, string, string];
};

export const BANDS: Band[] = [
  { id: 'black', kind: 'sport', name: 'Black', color: 0x34373c, swatch: '#3b3e43', accent: ['#eef0f2', '#aab1ba', '#6f7782'] },
  { id: 'olive', kind: 'sport', name: 'Olive Green', color: 0x48523f, swatch: '#5f6a55', accent: ['#e0e9d3', '#a4b98c', '#6d8259'] },
  { id: 'mocha', kind: 'sport', name: 'Mocha', color: 0xd3cab9, swatch: '#b8b09f', accent: ['#f4ecdd', '#d4c1a1', '#a48c68'] },
  { id: 'orange', kind: 'sport', name: 'Orange', color: 0xf26a26, swatch: '#f26b2b', accent: ['#ffc58f', '#ff7a1f', '#ff4d2e'] },
  { id: 'blue', kind: 'sport', name: 'Blue', color: 0x9cc3e5, swatch: '#93bce0', accent: ['#dcefff', '#8fc5f2', '#4b8fd1'] },
  { id: 'leather-black', kind: 'leather', name: 'Black', color: 0x2c2e32, swatch: '#3b3e43', accent: ['#eef0f2', '#aab1ba', '#6f7782'] },
  { id: 'leather-olive', kind: 'leather', name: 'Olive Green', color: 0x4b5243, swatch: '#5c6355', accent: ['#e0e9d3', '#a4b98c', '#6d8259'] },
  { id: 'leather-gray', kind: 'leather', name: 'Gray', color: 0x8a8e93, swatch: '#6f7377', accent: ['#eef1f4', '#b4bcc6', '#7d8692'] },
  { id: 'leather-camel', kind: 'leather', name: 'Camel', color: 0xa0653a, swatch: '#a8703f', accent: ['#f6dcc0', '#d39a62', '#a5683a'] },
  { id: 'leather-sand', kind: 'leather', name: 'Sand', color: 0xcdc7bb, swatch: '#9a9488', accent: ['#f2eee6', '#cfc6b6', '#9d9483'] },
];

export const DEFAULT_BAND = BANDS[1];
export const SPORT_BANDS = BANDS.filter((b) => b.kind === 'sport');
export const LEATHER_BANDS = BANDS.filter((b) => b.kind === 'leather');
export const KIND_NAME: Record<BandKind, string> = { sport: 'Sport Band', leather: 'Hybrid Leather Band' };
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
