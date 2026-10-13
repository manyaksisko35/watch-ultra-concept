import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const ORANGE = '#ff6a12';
const FONT = '"Inter Display", Inter, "Helvetica Neue", Arial, sans-serif';

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function canvasTex(size: number, draw: Draw, srgb = true, h = size) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) draw(ctx, size, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export type BezelColors = { bg: string; tick: string; marker: string; num: string };

export const DEFAULT_BEZEL: BezelColors = { bg: '#2a2b2f', tick: 'rgba(200,200,200,0.45)', marker: ORANGE, num: 'rgba(225,225,225,0.85)' };

function drawBezel(ctx: CanvasRenderingContext2D, S: number, col: BezelColors = DEFAULT_BEZEL) {
  ctx.fillStyle = col.bg;
  ctx.fillRect(0, 0, S, S);
  const c = S / 2;
  const k = S / 44;
  ctx.save();
  ctx.translate(c, c);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${1.05 * k}px ${FONT}`;
  for (let i = 1; i < 60; i++) {
    ctx.save();
    ctx.rotate((i / 60) * Math.PI * 2);
    const major = i % 5 === 0;
    if (major) {
      ctx.fillStyle = col.num;
      ctx.save();
      ctx.translate(0, -19.55 * k);
      if (i > 15 && i < 45) ctx.rotate(Math.PI);
      ctx.fillText(String(i).padStart(2, '0'), 0, 0);
      ctx.restore();
    } else {
      ctx.fillStyle = col.tick;
      ctx.fillRect((-0.2 * k) / 2, -20.75 * k, 0.2 * k, 0.6 * k);
    }
    ctx.restore();
  }
  ctx.fillStyle = col.marker;
  ctx.beginPath();
  ctx.moveTo(0, -19.0 * k);
  ctx.lineTo(-0.9 * k, -20.7 * k);
  ctx.lineTo(0.9 * k, -20.7 * k);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function bezelTexture(col: BezelColors) {
  const t = canvasTex(1024, (ctx, S) => drawBezel(ctx, S, col));
  t.repeat.set(1 / 44, 1 / 44);
  t.offset.set(0.5, 0.5);
  return t;
}

function drawBack(ctx: CanvasRenderingContext2D, S: number) {
  const c = S / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, '#2a2f35');
  g.addColorStop(0.62, '#1b1f23');
  g.addColorStop(0.64, '#9aa1a8');
  g.addColorStop(0.7, '#c8cdd2');
  g.addColorStop(0.76, '#7c838a');
  g.addColorStop(0.78, '#1d2024');
  g.addColorStop(1, '#141619');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(190,200,210,0.35)';
  ctx.lineWidth = S * 0.004;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  const dot = (x: number, y: number, r: number, col: string) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  dot(c, c, c * 0.075, '#0c0d10');
  dot(c, c, c * 0.045, '#3a3f74');
  ['#d7dbe0', '#4b3e9c', '#d7dbe0', '#4b3e9c'].forEach((col, i) => {
    const a = (i * Math.PI) / 2;
    dot(c + Math.cos(a) * c * 0.17, c + Math.sin(a) * c * 0.17, c * 0.035, col);
  });
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    dot(c + Math.cos(a) * c * 0.42, c + Math.sin(a) * c * 0.42, c * 0.02, '#8b939b');
  }
  ctx.save();
  ctx.translate(c, c);
  ctx.fillStyle = 'rgba(210,215,220,0.55)';
  ctx.font = `600 ${S * 0.024}px ${FONT}`;
  ctx.textAlign = 'center';
  const text = 'GALAXY WATCH ULTRA2 · TITANIUM · SAPPHIRE CRYSTAL · ';
  for (let i = 0; i < text.length; i++) {
    ctx.save();
    ctx.rotate((i / text.length) * Math.PI * 2);
    ctx.fillText(text[i], 0, -c * 0.86);
    ctx.restore();
  }
  ctx.restore();
}

function drawBuckleText(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = '#3c3e43';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#74777d';
  ctx.font = `700 ${H * 0.62}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${H * 0.12}px`;
  ctx.fillText('SAMSUNG', W / 2, H / 2 + 1);
}

function leatherTexture() {
  const t = canvasTex(256, (ctx, S) => {
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(0, 0, S, S);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 2600; i++) {
      const v = 200 + Math.floor(rnd() * 40);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.beginPath();
      ctx.arc(rnd() * S, rnd() * S, 0.6 + rnd() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const x of [S * 0.075, S * 0.925]) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(x - S * 0.012, 0, S * 0.024, S);
      ctx.fillStyle = '#f2f2f2';
      for (let y = 0; y < S; y += S / 8) {
        ctx.beginPath();
        ctx.roundRect(x - S * 0.009, y + S * 0.015, S * 0.018, S / 8 - S * 0.04, S * 0.009);
        ctx.fill();
      }
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function holeTexture() {
  return canvasTex(
    256,
    (ctx, S) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = '#000';
      const hole = (x: number) => {
        const w = S * 0.27;
        const h = S * 0.5;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, S / 2 - h / 2, w, h, S * 0.08);
        ctx.fill();
      };
      hole(S * 0.33);
      hole(S * 0.67);
    },
    false
  );
}

function caseShape(W: number, H: number, a: number, b: number, r: number) {
  const v = [
    [-a, H / 2],
    [a, H / 2],
    [W / 2, b],
    [W / 2, -b],
    [a, -H / 2],
    [-a, -H / 2],
    [-W / 2, -b],
    [-W / 2, b],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const s = new THREE.Shape();
  const n = v.length;
  for (let i = 0; i < n; i++) {
    const p = v[i];
    const d1 = v[(i + n - 1) % n].clone().sub(p).normalize().multiplyScalar(r);
    const d2 = v[(i + 1) % n].clone().sub(p).normalize().multiplyScalar(r);
    const a1 = p.clone().add(d1);
    const a2 = p.clone().add(d2);
    if (i === 0) s.moveTo(a1.x, a1.y);
    else s.lineTo(a1.x, a1.y);
    s.quadraticCurveTo(p.x, p.y, a2.x, a2.y);
  }
  s.closePath();
  return s;
}

function ribbon(
  curve: THREE.Curve<THREE.Vector3>,
  widthAt: (v: number) => number,
  thick: number,
  samples: number,
  faceMat: THREE.Material,
  edgeMat: THREE.Material,
  period: number
) {
  const X = new THREE.Vector3(1, 0, 0);
  const pts = curve.getSpacedPoints(samples);
  const len = curve.getLength();
  const N: THREE.Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = curve.getTangentAt(i / samples);
    N.push(new THREE.Vector3().crossVectors(t, X).normalize());
  }
  const top: number[] = [];
  const bot: number[] = [];
  const uv: number[] = [];
  const Wd: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const s = (i / samples) * len;
    const w = widthAt(s / period);
    Wd.push(w);
    const p = pts[i];
    const o = N[i].clone().multiplyScalar(thick / 2);
    for (const side of [-1, 1]) {
      top.push(p.x + (side * w) / 2 + o.x, p.y + o.y, p.z + o.z);
      bot.push(p.x + (side * w) / 2 - o.x, p.y - o.y, p.z - o.z);
      uv.push(side < 0 ? 0 : 1, s / period);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < samples; i++) {
    const a = i * 2;
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const flip = idx.map((_, k) => idx[k - (k % 3) + (2 - (k % 3))]);
  const geo = (pos: number[], ind: number[], withUv: boolean) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    if (withUv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(ind);
    g.computeVertexNormals();
    return g;
  };
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geo(top, idx, true), faceMat));
  group.add(new THREE.Mesh(geo(bot, flip, true), faceMat));
  for (const side of [-1, 1]) {
    const pos: number[] = [];
    for (let i = 0; i <= samples; i++) {
      const p = pts[i];
      const o = N[i].clone().multiplyScalar(thick / 2);
      const x = p.x + (side * Wd[i]) / 2;
      pos.push(x, p.y + o.y, p.z + o.z, x, p.y - o.y, p.z - o.z);
    }
    group.add(new THREE.Mesh(geo(pos, side > 0 ? idx : flip, false), edgeMat));
  }
  return group;
}

export type WatchRig = {
  root: THREE.Group;
  caseMat: THREE.MeshPhysicalMaterial;
  bezelMat: THREE.MeshPhysicalMaterial;
  band: THREE.Group;
  sportBand: THREE.Group;
  leatherBand: THREE.Group;
  bandMats: THREE.MeshStandardMaterial[];
  leatherMats: THREE.MeshStandardMaterial[];
  displayMat: THREE.MeshPhysicalMaterial;
  anchors: Record<'quick' | 'crystal' | 'titanium' | 'sensor' | 'band', THREE.Vector3>;
};

export function buildWatch(faceTex: THREE.Texture, opts: { caseColor?: THREE.ColorRepresentation; bandColor?: THREE.ColorRepresentation } = {}): WatchRig {
  const caseColor = opts.caseColor ?? 0x3a3c41;
  const bandColor = opts.bandColor ?? 0xe8530c;
  const root = new THREE.Group();

  const titanium = new THREE.MeshPhysicalMaterial({ color: caseColor, metalness: 0.9, roughness: 0.34, envMapIntensity: 0.7, clearcoat: 0.3, clearcoatRoughness: 0.25 });
  const titaniumDark = new THREE.MeshPhysicalMaterial({ color: 0x24252a, metalness: 0.85, roughness: 0.4, envMapIntensity: 0.6 });
  const polished = new THREE.MeshPhysicalMaterial({ color: 0x8a8e95, metalness: 1, roughness: 0.18, envMapIntensity: 0.9 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xff6a12, metalness: 0.3, roughness: 0.38 });

  const W = 46.5;
  const H = 47.4;
  const depth = 7.2;
  const bevel = 2.0;
  const shape = caseShape(W - bevel * 2, H - bevel * 2, 12.4, 13.0, 4.6);
  const caseGeo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 16 });
  caseGeo.translate(0, 0, -depth / 2 - 0.4);
  root.add(new THREE.Mesh(caseGeo, titanium));
  const topZ = depth / 2 - 0.4 + bevel;
  const backZ = -depth / 2 - 0.4 - bevel;

  const ring = (rOut: number, rIn: number, h: number, mats: THREE.Material | THREE.Material[], z: number, bev = 0.35) => {
    const s = new THREE.Shape();
    s.absarc(0, 0, rOut, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, rIn, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 120 });
    const m = new THREE.Mesh(g, mats);
    m.position.z = z;
    return m;
  };

  const bezelTex = bezelTexture(DEFAULT_BEZEL);
  const bezelTop = new THREE.MeshPhysicalMaterial({ map: bezelTex, metalness: 0.4, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.1, envMapIntensity: 0.5 });
  root.add(ring(21.0, 18.5, 0.9, [bezelTop, polished], topZ - 0.3, 0.3));
  root.add(ring(21.25, 20.9, 1.0, polished, topZ - 0.4, 0.15));
  root.add(ring(18.55, 18.0, 0.7, titaniumDark, topZ - 0.2, 0.1));

  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.anisotropy = 8;
  const displayMat = new THREE.MeshPhysicalMaterial({ map: faceTex, emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 0.6, roughness: 0.35, metalness: 0, specularIntensity: 0.2, clearcoat: 0.35, clearcoatRoughness: 0.08, envMapIntensity: 0.5 });
  const display = new THREE.Mesh(new THREE.CircleGeometry(18.05, 128), displayMat);
  display.position.z = topZ + 0.3;
  root.add(display);

  const sidePanel = new THREE.Mesh(new RoundedBoxGeometry(1.2, 34, 5.4, 3, 0.5), titanium);
  sidePanel.position.set(W / 2 - 0.5, -0.5, -0.6);
  root.add(sidePanel);
  const button = (y: number, kind: 'quick' | 'pill') => {
    const g = new THREE.Group();
    if (kind === 'pill') {
      g.add(new THREE.Mesh(new RoundedBoxGeometry(2.6, 6.6, 3.4, 4, 1.15), titaniumDark));
    } else {
      const r = 3.0;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.4, 40), titaniumDark);
      cap.rotation.z = Math.PI / 2;
      g.add(cap);
      const knurl = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.72, 2.5, 24), polished);
      knurl.rotation.z = Math.PI / 2;
      g.add(knurl);
      const rr = new THREE.Mesh(new THREE.TorusGeometry(r * 0.84, 0.75, 12, 48), orange);
      rr.rotation.y = Math.PI / 2;
      rr.position.x = 1.25;
      g.add(rr);
    }
    g.position.set(W / 2 + 0.3, y, -0.6);
    root.add(g);
  };
  button(12.6, 'pill');
  button(0, 'quick');
  button(-12.6, 'pill');

  const backTex = canvasTex(1024, drawBack);
  const backMat = new THREE.MeshPhysicalMaterial({ map: backTex, roughness: 0.18, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 });
  const sensor = new THREE.Mesh(new THREE.CylinderGeometry(17.2, 18.6, 1.4, 128), [polished, backMat, backMat]);
  sensor.rotation.x = Math.PI / 2;
  sensor.position.z = backZ - 0.6;
  root.add(sensor);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.35, 20), polished);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(Math.cos(a) * 21, Math.sin(a) * 21, backZ - 0.05);
    root.add(screw);
  }

  const holes = holeTexture();
  holes.wrapS = holes.wrapT = THREE.RepeatWrapping;
  const bandFace = new THREE.MeshStandardMaterial({ color: bandColor, roughness: 0.78, metalness: 0, envMapIntensity: 0.2, alphaMap: holes, alphaTest: 0.5, side: THREE.DoubleSide });
  const bandEdge = new THREE.MeshStandardMaterial({ color: bandColor, roughness: 0.78, metalness: 0, envMapIntensity: 0.2, side: THREE.DoubleSide });
  const path = new THREE.CatmullRomCurve3(
    [
      [0, 17.5, -2.8],
      [0, 25, -4.2],
      [0, 31, -9],
      [0, 35, -18],
      [0, 34.5, -29],
      [0, 27, -39],
      [0, 14, -44.5],
      [0, 0, -46],
      [0, -14, -44.5],
      [0, -27, -39],
      [0, -34.5, -29],
      [0, -35, -18],
      [0, -31, -9],
      [0, -25, -4.2],
      [0, -17.5, -2.8],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal'
  );
  const widthAt = () => 22.5;
  const band = new THREE.Group();
  root.add(band);
  const sportBand = ribbon(path, widthAt, 3.2, 500, bandFace, bandEdge, 9);
  band.add(sportBand);
  const leather = leatherTexture();
  const leatherFace = new THREE.MeshStandardMaterial({ color: bandColor, map: leather, bumpMap: leather, bumpScale: 0.6, roughness: 0.7, metalness: 0, envMapIntensity: 0.25, side: THREE.DoubleSide });
  const leatherEdge = new THREE.MeshStandardMaterial({ color: bandColor, roughness: 0.75, metalness: 0, envMapIntensity: 0.2, side: THREE.DoubleSide });
  const leatherBand = ribbon(path, widthAt, 3.6, 500, leatherFace, leatherEdge, 9);
  leatherBand.visible = false;
  band.add(leatherBand);

  const buckleMat = new THREE.MeshPhysicalMaterial({ color: 0x45474c, metalness: 0.9, roughness: 0.32, envMapIntensity: 0.8 });
  const t = 0.33;
  const p = path.getPointAt(t);
  const T = path.getTangentAt(t);
  const Xv = new THREE.Vector3(1, 0, 0);
  const Nn = new THREE.Vector3().crossVectors(T, Xv).normalize();
  const buckle = new THREE.Group();
  const bw = 29;
  const bt = 6.4;
  const bl = 6.5;
  const bar = (sx: number, sy: number, sz: number, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(sx, sy, sz, 3, Math.min(sx, sy, sz) * 0.45), buckleMat);
    m.position.set(x, y, z);
    buckle.add(m);
  };
  bar(bw, 2.0, bl, 0, bt / 2, 0);
  bar(bw, 2.0, bl, 0, -bt / 2, 0);
  bar(2.4, bt + 2, bl, bw / 2, 0, 0);
  bar(2.4, bt + 2, bl, -bw / 2, 0, 0);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(bw * 0.7, bl * 0.42),
    new THREE.MeshPhysicalMaterial({ map: canvasTex(512, drawBuckleText, true, 96), metalness: 0.8, roughness: 0.35 })
  );
  label.position.set(0, bt / 2 + 1.01, 0);
  label.rotation.x = -Math.PI / 2;
  buckle.add(label);
  buckle.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(Xv, Nn, T));
  buckle.position.copy(p);
  band.add(buckle);

  return {
    root,
    caseMat: titanium,
    bezelMat: bezelTop,
    band,
    sportBand,
    leatherBand,
    bandMats: [bandFace, bandEdge],
    leatherMats: [leatherFace, leatherEdge],
    displayMat,
    anchors: {
      quick: new THREE.Vector3(W / 2 + 1.6, 0, -0.6),
      crystal: new THREE.Vector3(-9, 9, topZ + 0.5),
      titanium: new THREE.Vector3(-W / 2 + 1.5, -14, 2),
      sensor: new THREE.Vector3(0, 0, backZ - 1.4),
      band: new THREE.Vector3(0, -33, -22),
    },
  };
}
