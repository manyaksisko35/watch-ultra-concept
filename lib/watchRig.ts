'use client';

import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { bezelTexture, buildWatch, type BezelColors, type WatchRig } from '@/lib/watchModel';

export const FACE_URL = '/face/ultra.webp';
const MM = 0.03;

type FaceMode = 'dark' | 'blue' | 'white';

export type Variant = {
  id: string;
  name: string;
  swatch: string;
  caseColor: number;
  bandColor: number;
  bezel: BezelColors;
  face: FaceMode;
};

export const VARIANTS: Variant[] = [
  {
    id: 'blue',
    name: 'Titanium Blue',
    swatch: 'linear-gradient(135deg,#3d5a86,#22385e)',
    caseColor: 0xb0b5bb,
    bandColor: 0x243a63,
    bezel: { bg: '#1e365e', tick: 'rgba(205,215,235,0.6)', major: '#ff6a12', marker: '#ff6a12' },
    face: 'blue',
  },
  {
    id: 'silver',
    name: 'Titanium Silver',
    swatch: 'linear-gradient(135deg,#d2ccc0,#a39d91)',
    caseColor: 0xa29c90,
    bandColor: 0x3b3f44,
    bezel: { bg: '#141517', tick: 'rgba(215,215,215,0.6)', major: '#f2f2f2', marker: '#f2f2f2' },
    face: 'dark',
  },
  {
    id: 'gray',
    name: 'Titanium Gray',
    swatch: 'linear-gradient(135deg,#6a6b70,#3c3d41)',
    caseColor: 0x3f4044,
    bandColor: 0xf0701a,
    bezel: { bg: '#141517', tick: 'rgba(210,210,210,0.55)', major: '#ff6a12', marker: '#ff6a12' },
    face: 'dark',
  },
  {
    id: 'white',
    name: 'Titanium White',
    swatch: 'linear-gradient(135deg,#f1f2f3,#c3c6ca)',
    caseColor: 0xc3c6cb,
    bandColor: 0xe3e1db,
    bezel: { bg: '#d6d8dc', tick: 'rgba(110,115,122,0.7)', major: '#9fa3a9', marker: '#b9bcc1' },
    face: 'white',
  },
];

export const DEFAULT_VARIANT = VARIANTS[2];

export type Rig = WatchRig & { pivot: THREE.Group; bandOpacity: number; face: THREE.Texture };

export function useWatchRig(): Rig {
  const face = useTexture(FACE_URL);
  return useMemo(() => {
    const rig = buildWatch(face, { caseColor: DEFAULT_VARIANT.caseColor, bandColor: DEFAULT_VARIANT.bandColor });
    rig.root.scale.setScalar(MM);
    rig.root.position.z = 0.4 * MM;
    const pivot = new THREE.Group();
    pivot.add(rig.root);
    rig.band.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.transparent = true;
    });
    return { ...rig, pivot, bandOpacity: 1, face };
  }, [face]);
}

const bezelCache = new Map<string, THREE.Texture>();
const faceCache = new Map<string, THREE.Texture>();

function recolorFace(src: THREE.Texture, mode: FaceMode) {
  const img = src.image as CanvasImageSource & { width: number; height: number };
  const cv = document.createElement('canvas');
  cv.width = img.width;
  cv.height = img.height;
  const ctx = cv.getContext('2d');
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, cv.width, cv.height);
  const d = data.data;
  const navy = [26, 47, 88];
  const light = [236, 237, 239];
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const sat = mx > 0 ? (mx - mn) / mx : 0;
    const keep = Math.min(1, Math.max(0, (sat - 0.25) / 0.25));
    const gray = (r + g + b) / 3;
    for (let c = 0; c < 3; c++) {
      const v = d[i + c];
      const t = mode === 'blue' ? navy[c] + gray * (1 - navy[c] / 255) : light[c] - gray * ((light[c] - 34) / 255);
      d[i + c] = t + (v - t) * keep;
    }
  }
  ctx.putImageData(data, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function applyVariant(rig: Rig, v: Variant) {
  rig.caseMat.color.setHex(v.caseColor);
  rig.bandMats.forEach((m) => m.color.setHex(v.bandColor));
  let bezel = bezelCache.get(v.id);
  if (!bezel) {
    bezel = bezelTexture(v.bezel);
    bezelCache.set(v.id, bezel);
  }
  rig.bezelMat.map = bezel;
  let face = v.face === 'dark' ? rig.face : faceCache.get(v.face);
  if (!face) {
    face = recolorFace(rig.face, v.face);
    faceCache.set(v.face, face);
  }
  rig.displayMat.map = face;
  rig.displayMat.emissiveMap = face;
  rig.displayMat.emissiveIntensity = v.face === 'white' ? 0.35 : 0.6;
}

export function setBandOpacity(rig: Rig, op: number) {
  const v = Math.round(op * 100) / 100;
  if (v === rig.bandOpacity) return;
  rig.bandOpacity = v;
  rig.band.visible = v > 0.01;
  rig.band.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | undefined;
    if (!m) return;
    m.opacity = v;
    if (m.alphaTest > 0) m.alphaTest = Math.max(0.01, 0.5 * v);
    m.depthWrite = v > 0.98;
  });
}

const RED = new THREE.Color(1, 0.04, 0.02);
const WHITE = new THREE.Color(1, 1, 1);

export function setNight(rig: Rig, k: number) {
  rig.displayMat.color.copy(WHITE).lerp(RED, k);
  rig.displayMat.emissive.copy(WHITE).lerp(RED, k);
}

export type Pose = { x: number; y: number; s: number; rx: number; ry: number; rz: number };

export function poseRig(rig: Rig, p: Pose) {
  rig.pivot.position.set(p.x, p.y, 0);
  rig.pivot.scale.setScalar(p.s);
  rig.pivot.rotation.set(p.rx, p.ry, p.rz);
}
