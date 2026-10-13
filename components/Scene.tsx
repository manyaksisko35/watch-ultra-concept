'use client';

import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { Html, PerformanceMonitor } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { setLenis } from '@/lib/lenis';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { RimLight, StudioEnv } from '@/components/StudioEnv';
import { poseRig, setBandOpacity, setNight, useWatchRig, type Pose, type Rig } from '@/lib/watchRig';
import { heroSpin, stepSpin } from '@/lib/dragSpin';
import { stageNight } from '@/lib/stage';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type StagePose = Pose & { band: number; hotA: number; hotB: number };

const DESKTOP: Record<'hero' | 'titanium' | 'display' | 'sensor', StagePose> = {
  hero: { x: 0, y: -0.62, s: 0.86, rx: 0.22, ry: -0.6, rz: 0, band: 1, hotA: 0, hotB: 0 },
  titanium: { x: 0.75, y: -0.05, s: 1.05, rx: 0.12, ry: -1.18, rz: 0.04, band: 1, hotA: 1, hotB: 0 },
  display: { x: 0.85, y: 0, s: 1.75, rx: 0, ry: 0, rz: 0, band: 1, hotA: 0, hotB: 0 },
  sensor: { x: 0.9, y: 0, s: 1.45, rx: 0.12, ry: Math.PI + 0.35, rz: 0, band: 0, hotA: 0, hotB: 1 },
};

const MOBILE: typeof DESKTOP = {
  hero: { x: -0.1, y: -0.62, s: 0.62, rx: 0.22, ry: -0.6, rz: 0, band: 1, hotA: 0, hotB: 0 },
  titanium: { x: 0.18, y: -0.55, s: 0.6, rx: 0.12, ry: -1.18, rz: 0.04, band: 1, hotA: 1, hotB: 0 },
  display: { x: 0, y: -0.5, s: 0.85, rx: 0, ry: 0, rz: 0, band: 1, hotA: 0, hotB: 0 },
  sensor: { x: -0.08, y: -0.5, s: 0.8, rx: 0.12, ry: Math.PI + 0.35, rz: 0, band: 0, hotA: 0, hotB: 1 },
};

const pose: StagePose = { ...DESKTOP.hero };

const HOTSPOTS = [
  { key: 'crystal', group: 'hotA', title: 'Sapphire crystal', text: 'Scratch-resistant glass over a 3,000-nit display.' },
  { key: 'quick', group: 'hotA', title: 'Quick Button', text: 'Start a workout, or hold for the emergency siren.' },
  { key: 'titanium', group: 'hotA', title: 'Grade 4 titanium', text: 'A light, tough case built for the outdoors.' },
  { key: 'sensor', group: 'hotB', title: 'BioActive Sensor', text: 'Heart rate, ECG and body composition in one.' },
] as const;

function Hotspots({ rig }: { rig: Rig }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    let n = 0;
    HOTSPOTS.forEach((h, i) => {
      const el = refs.current[i];
      if (!el) return;
      const v = pose[h.group];
      const k = Math.min(1, Math.max(0, v * 3 - (h.group === 'hotA' ? n++ : 0) * 0.6));
      el.style.opacity = String(k);
      el.style.transform = `translateY(${(1 - k) * 10}px)`;
      el.style.visibility = k <= 0.01 ? 'hidden' : 'visible';
    });
  });

  return createPortal(
    <>
      {HOTSPOTS.map((h, i) => (
        <Html key={h.key} position={rig.anchors[h.key]} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="hotspot"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <span className="hotspot__dot" />
            <span className="hotspot__line" />
            <span className="hotspot__card">
              <strong>{h.title}</strong>
              <em>{h.text}</em>
            </span>
          </div>
        </Html>
      ))}
    </>,
    rig.root
  );
}

function Watch() {
  const rig = useWatchRig();
  const reduce = useMemo(() => prefersReducedMotion(), []);
  const frameRef = useRef<Pose>({ ...DESKTOP.hero });
  const night = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.loaded = '1';
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    stepSpin(heroSpin, dt);
    const t = state.clock.elapsedTime;
    const bob = reduce ? 0 : Math.sin(t * 1.1) * 0.02;
    const f = frameRef.current;
    f.x = pose.x;
    f.y = pose.y + bob;
    f.s = pose.s;
    f.rx = pose.rx + heroSpin.pitch;
    f.ry = pose.ry + heroSpin.yaw;
    f.rz = pose.rz;
    poseRig(rig, f);
    setBandOpacity(rig, pose.band);
    night.current = THREE.MathUtils.damp(night.current, stageNight.on ? 1 : 0, 6, dt);
    setNight(rig, night.current);
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (P: typeof DESKTOP) => {
      Object.assign(pose, P.hero);
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power2.inOut' },
        scrollTrigger: { trigger: '#stage', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
      });
      tl.to(pose, { ...P.titanium, hotA: 0 }, 0)
        .to(pose, { hotA: 1, duration: 0.5 }, 1)
        .to(pose, { hotA: 0, duration: 0.3 }, 1.9)
        .to(pose, { ...P.display, duration: 1.2 }, 2.2)
        .to(pose, { ...P.sensor, hotB: 0, duration: 1.4 }, 4.0)
        .to(pose, { hotB: 1, duration: 0.5 }, 5.4)
        .to({ idle: 0 }, { idle: 1, duration: 0.8 }, 6.0);
    };
    mm.add('(min-width: 1024px)', () => build(DESKTOP));
    mm.add('(max-width: 1023px)', () => build(MOBILE));
    return () => mm.revert();
  }, []);

  return (
    <>
      <primitive object={rig.pivot} />
      <Hotspots rig={rig} />
    </>
  );
}

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: prefersReducedMotion() ? 1 : 0.1 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      setLenis(null);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export default function Scene() {
  const [dpr, setDpr] = useState(1.25);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById('stage');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SmoothScroll />
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 30 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.5))} />
        <CameraRig />
        <StudioEnv intensity={0.8} />
        <RimLight />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 4]} intensity={2} />
        <directionalLight position={[-4, -2, -3]} intensity={1.0} color="#ffb98a" />
        <Suspense fallback={null}>
          <Watch />
        </Suspense>
      </Canvas>
    </>
  );
}
