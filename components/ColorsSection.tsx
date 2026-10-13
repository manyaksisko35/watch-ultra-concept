'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { RimLight, SoftShadow, StudioEnv } from '@/components/StudioEnv';
import { DEFAULT_VARIANT, VARIANTS, applyVariant, poseRig, useWatchRig, type Pose, type Variant } from '@/lib/watchRig';
import { createSpin, stepSpin, useDragSpin } from '@/lib/dragSpin';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { PRICE } from '@/lib/specs';

const spin = createSpin();

function Product({ variant }: { variant: Variant }) {
  const rig = useWatchRig();
  const invalidate = useThree((s) => s.invalidate);
  const turn = useRef(0);
  const reduce = useRef(prefersReducedMotion());
  const frame = useRef<Pose>({ x: 0, y: 0.08, s: 1.3, rx: 0.2, ry: -0.5, rz: 0 });

  useEffect(() => {
    applyVariant(rig, variant);
    invalidate();
  }, [rig, variant, invalidate]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    stepSpin(spin, dt);
    if (!reduce.current && !spin.dragging) turn.current += dt * 0.25;
    const f = frame.current;
    f.rx = 0.2 + spin.pitch;
    f.ry = -0.5 + Math.sin(turn.current) * 0.5 + spin.yaw;
    poseRig(rig, f);
  });

  return (
    <>
      <primitive object={rig.pivot} />
      <SoftShadow y={-1.35} width={2.6} depth={1.6} opacity={0.5} />
    </>
  );
}

function Swatches<T extends { id: string; name: string; swatch: string }>(props: { label: string; items: readonly T[]; value: string; onChange: (id: string) => void }) {
  return (
    <>
      <p className="sg-eyebrow !text-[0.65rem] mb-3">{props.label}</p>
      <div className="flex gap-3 mb-6" role="radiogroup" aria-label={props.label}>
        {props.items.map((c) => (
          <button
            key={c.id}
            role="radio"
            aria-checked={c.id === props.value}
            aria-label={c.name}
            title={c.name}
            onClick={() => props.onChange(c.id)}
            className={`w-11 h-11 rounded-full border transition-transform ${
              c.id === props.value ? 'border-white scale-110 ring-2 ring-white/40 ring-offset-2 ring-offset-black' : 'border-white/25'
            }`}
            style={{ background: c.swatch }}
          />
        ))}
      </div>
    </>
  );
}

export default function ColorsSection() {
  const [variantId, setVariantId] = useState<string>(DEFAULT_VARIANT.id);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pick = useCallback(() => spin, []);
  useDragSpin(stageRef, pick);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mount = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: '150% 0px' });
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    mount.observe(el);
    vis.observe(el);
    return () => {
      mount.disconnect();
      vis.disconnect();
    };
  }, []);

  const cur = VARIANTS.find((c) => c.id === variantId) ?? DEFAULT_VARIANT;

  return (
    <section ref={sectionRef} id="colors" className="sg-ambient amb-silver relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="text-center mb-6 lg:mb-10">
        <p className="sg-eyebrow mb-3 lg:mb-5">Colors</p>
        <h2 className="sg-title">
          Make it <strong className="sg-ai">yours.</strong>
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 max-w-6xl mx-auto">
        <div ref={stageRef} className="relative w-full max-w-[560px] h-[48svh] lg:h-[64svh] touch-pan-y select-none cursor-grab data-[dragging]:cursor-grabbing">
          {mounted && (
            <Canvas
              frameloop={visible ? 'always' : 'never'}
              camera={{ position: [0, 0.4, 6.2], fov: 30 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}
            >
              <StudioEnv intensity={0.9} />
              <RimLight />
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 4, 4]} intensity={2} />
              <Suspense fallback={null}>
                <Product variant={cur} />
              </Suspense>
            </Canvas>
          )}
          <p className="absolute bottom-1 inset-x-0 text-center text-xs text-white/40 pointer-events-none">Drag to rotate</p>
        </div>

        <div className="w-full max-w-sm">
          <p className="text-white/50 text-sm mb-1">Galaxy Watch Ultra2 · 47 mm</p>
          <p className="text-3xl lg:text-4xl font-semibold mb-6">{cur.name}</p>
          <Swatches label="Color" items={VARIANTS} value={variantId} onChange={setVariantId} />
          <div className="flex items-end justify-between border-t border-white/10 pt-5">
            <div>
              <p className="text-white/50 text-sm">Price</p>
              <p className="text-3xl font-semibold tabular-nums">{PRICE}</p>
            </div>
            <a href="#specs" className="sg-btn">
              Continue
            </a>
          </div>
          <p className="mt-4 text-[0.7rem] text-white/40">Samsung US list price at launch (LTE). Availability and colors vary by market.</p>
        </div>
      </div>
    </section>
  );
}
