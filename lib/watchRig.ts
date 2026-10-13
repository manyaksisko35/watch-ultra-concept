'use client';

import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { buildWatch, type WatchRig } from '@/lib/watchModel';

export const FACE_URL = '/face/ultra.webp';
const MM = 0.03;

export const CASE_COLORS = [
  { id: 'gray', name: 'Titanium Gray', color: 0x3a3c41, swatch: 'linear-gradient(135deg,#5a5d63,#2b2d31)' },
  { id: 'silver', name: 'Titanium Silver', color: 0x9a9ea5, swatch: 'linear-gradient(135deg,#d6d9dd,#8d9198)' },
  { id: 'white', name: 'Titanium White', color: 0xd4d3cd, swatch: 'linear-gradient(135deg,#f4f3ee,#c4c3bc)' },
] as const;

export const BAND_COLORS = [
  { id: 'orange', name: 'Orange', color: 0xe8530c, swatch: '#f0661c' },
  { id: 'gray', name: 'Dark Gray', color: 0x2c2e33, swatch: '#3a3c42' },
  { id: 'white', name: 'White', color: 0xe7e5df, swatch: '#ecebe6' },
] as const;

export type Rig = WatchRig & { pivot: THREE.Group; bandOpacity: number };

export function useWatchRig(caseColor?: number, bandColor?: number): Rig {
  const face = useTexture(FACE_URL);
  return useMemo(() => {
    const rig = buildWatch(face, { caseColor, bandColor });
    rig.root.scale.setScalar(MM);
    rig.root.position.z = 0.4 * MM;
    const pivot = new THREE.Group();
    pivot.add(rig.root);
    rig.band.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.transparent = true;
    });
    return { ...rig, pivot, bandOpacity: 1 };
    // Colors are applied afterwards with applyColors, so the model is built once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [face]);
}

export function applyColors(rig: Rig, caseColor: number, bandColor: number) {
  rig.caseMat.color.setHex(caseColor);
  rig.bandMats.forEach((m) => m.color.setHex(bandColor));
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
