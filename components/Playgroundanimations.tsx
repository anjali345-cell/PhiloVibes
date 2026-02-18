"use client";

/**
 * PlaygroundAnimations.tsx
 *
 * Exports:
 *  - HeroBackground   — full-page AlphaQubit-style orbs + orbital rings
 *  - ReflectCanvas    — per-reflect Three.js animation (6 random themes)
 *  - THEMES           — metadata for each theme (name, glyph, tagline)
 *  - AnimTheme        — type alias 0–5
 *  - ScrambleText     — character-scramble text reveal
 *  - RevealText       — letter-by-letter text reveal
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────
export type AnimTheme = 0 | 1 | 2 | 3 | 4 | 5;

export const THEMES: Record<AnimTheme, { name: string; glyph: string; tagline: string }> = {
  0: { name: "Golden Supernova",       glyph: "✦", tagline: "A universe born from your words"  },
  1: { name: "Ink Bloom",              glyph: "⌘", tagline: "Calligraphy of the mind"           },
  2: { name: "Crystal Lattice",        glyph: "◈", tagline: "Thoughts crystallize into form"    },
  3: { name: "Firefly Constellation",  glyph: "⊹", tagline: "Ideas that find each other"        },
  4: { name: "Aurora Ribbons",         glyph: "≋", tagline: "Light that moves like feeling"     },
  5: { name: "Sacred Geometry",        glyph: "◎", tagline: "The mathematics of meaning"        },
};

// ─── Theme builders ───────────────────────────────────────────────────────────
// Each returns a per-frame tick() called inside requestAnimationFrame

function buildSupernova(scene: THREE.Scene, clock: THREE.Clock) {
  const COUNT = 500;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const palette = ["#FFD580", "#A67C52", "#FFF8E8", "#C49A6C", "#E8C87A"].map(c => new THREE.Color(c));
  for (let i = 0; i < COUNT; i++) {
    const phi = Math.random() * Math.PI * 2, theta = Math.acos(2 * Math.random() - 1);
    const speed = 1.2 + Math.random() * 3.5;
    vel[i*3] = Math.sin(theta)*Math.cos(phi)*speed;
    vel[i*3+1] = Math.sin(theta)*Math.sin(phi)*speed;
    vel[i*3+2] = Math.cos(theta)*speed*0.4;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  const cv = document.createElement("canvas"); cv.width = cv.height = 64;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.3, "rgba(255,220,120,0.8)"); g.addColorStop(1, "rgba(255,200,80,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, map: new THREE.CanvasTexture(cv), transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Points(geo, mat));
  return () => {
    const t = clock.getElapsedTime();
    const p = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) { vel[i*3]*=0.978; vel[i*3+1]*=0.978; vel[i*3+2]*=0.978; p[i*3]+=vel[i*3]*0.016; p[i*3+1]+=vel[i*3+1]*0.016; p[i*3+2]+=vel[i*3+2]*0.016; }
    geo.attributes.position.needsUpdate = true;
    mat.opacity = Math.max(0, 1 - t * 0.22);
  };
}

function buildInkBloom(scene: THREE.Scene, clock: THREE.Clock) {
  const STRANDS = 18, SEG = 50;
  const strands: { line: THREE.Line; curve: THREE.CatmullRomCurve3; progress: number; speed: number; delay: number }[] = [];
  const palette = ["#C49A6C","#8B6A46","#A67C52","#D4B896","#FFD580"];
  for (let s = 0; s < STRANDS; s++) {
    const angle = (s / STRANDS) * Math.PI * 2;
    const pts = [new THREE.Vector3(0, 0, 0)]; let x=0, y=0, z=0;
    for (let i = 0; i < SEG; i++) { x += Math.cos(angle+i*0.35+(Math.random()-0.5)*0.8)*0.2; y += (Math.random()-0.35)*0.28; z += Math.sin(angle+i*0.35+(Math.random()-0.5)*0.8)*0.2; pts.push(new THREE.Vector3(x,y,z)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(palette[s % palette.length]), transparent: true, opacity: 0 });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(120)), mat);
    scene.add(line);
    strands.push({ line, curve, progress: 0, speed: 0.5 + Math.random()*0.8, delay: s*0.06 });
  }
  return () => {
    const t = clock.getElapsedTime();
    strands.forEach(s => {
      if (t < s.delay) return;
      s.progress = Math.min(1, s.progress + 0.007 * s.speed);
      const ng = new THREE.BufferGeometry().setFromPoints(s.curve.getPoints(Math.floor(s.progress*120)+2));
      s.line.geometry.dispose(); s.line.geometry = ng;
      (s.line.material as THREE.LineBasicMaterial).opacity = Math.min(0.9, s.progress*2.5) * Math.max(0, 1-Math.max(0,t-4)*0.2);
    });
  };
}

function buildCrystalLattice(scene: THREE.Scene, clock: THREE.Clock) {
  const specs = [
    { geo: new THREE.IcosahedronGeometry(1.0,0),   color:"#C49A6C", x:0,   y:0,   z:0,   rx:0,   ry:0.5,  rz:0   },
    { geo: new THREE.OctahedronGeometry(0.6,0),    color:"#A67C52", x:1.6, y:0.6, z:-0.3,rx:0.3, ry:0,    rz:0.25},
    { geo: new THREE.TetrahedronGeometry(0.5,0),   color:"#D4B896", x:-1.5,y:-0.5,z:0.4, rx:0.2, ry:0.4,  rz:0.1 },
    { geo: new THREE.DodecahedronGeometry(0.4,0),  color:"#FFD580", x:0.6, y:-1.2,z:0.7, rx:0.4, ry:0.2,  rz:0   },
    { geo: new THREE.OctahedronGeometry(0.35,0),   color:"#8B6A46", x:-0.9,y:1.1, z:-0.5,rx:0.5, ry:0.35, rz:0.15},
  ];
  const meshes = specs.map(s => {
    const mat = new THREE.MeshBasicMaterial({ color: s.color, wireframe: true, transparent: true, opacity: 0 });
    const m = new THREE.Mesh(s.geo, mat); m.position.set(s.x,s.y,s.z); m.scale.setScalar(0); scene.add(m);
    return { m, ...s };
  });
  return () => {
    const t = clock.getElapsedTime();
    meshes.forEach(({ m, rx, ry, rz }, i) => {
      m.rotation.x+=rx*0.012; m.rotation.y+=ry*0.012; m.rotation.z+=rz*0.012;
      const lt = Math.max(0, t-i*0.15);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.min(0.8,lt*0.6)*(0.6+0.4*Math.sin(t*1.5+i));
      m.scale.setScalar(Math.min(1,lt*3)+0.06*Math.sin(t*2+i*1.4));
    });
  };
}

function buildFireflies(scene: THREE.Scene, clock: THREE.Clock) {
  const N = 50;
  const flies: { sprite: THREE.Sprite; vel: THREE.Vector3; phase: number }[] = [];
  for (let i = 0; i < N; i++) {
    const cv = document.createElement("canvas"); cv.width = cv.height = 32;
    const ctx = cv.getContext("2d")!;
    const g = ctx.createRadialGradient(16,16,0,16,16,16);
    g.addColorStop(0,"rgba(255,220,100,1)"); g.addColorStop(0.4,"rgba(200,140,50,0.5)"); g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g; ctx.fillRect(0,0,32,32);
    const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.setScalar(0.15+Math.random()*0.1);
    sprite.position.set((Math.random()-0.5)*7,(Math.random()-0.5)*4,(Math.random()-0.5)*3);
    scene.add(sprite);
    flies.push({ sprite, vel: new THREE.Vector3((Math.random()-0.5)*0.5,(Math.random()-0.5)*0.5,(Math.random()-0.5)*0.3), phase: Math.random()*Math.PI*2 });
  }
  const lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineBasicMaterial({ color:"#A67C52", transparent: true, opacity: 0 });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));
  return () => {
    const t = clock.getElapsedTime(); const positions: number[] = [];
    flies.forEach(f => {
      f.sprite.position.addScaledVector(f.vel, 0.016);
      (["x","y","z"] as const).forEach(ax => { const lim = ax==="z"?2:ax==="y"?2.5:4; if(Math.abs(f.sprite.position[ax])>lim) f.vel[ax]*=-1; });
      f.sprite.material.opacity = Math.min(1,t*0.5)*Math.max(0,0.3+0.7*Math.sin(t*2+f.phase)*Math.sin(t*0.7+f.phase*1.3));
    });
    for (let a=0;a<flies.length;a++) for (let b=a+1;b<flies.length;b++)
      if (flies[a].sprite.position.distanceTo(flies[b].sprite.position)<1.8)
        positions.push(...flies[a].sprite.position.toArray(),...flies[b].sprite.position.toArray());
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions,3));
    lineMat.opacity = Math.min(0.18, t*0.08);
  };
}

function buildAurora(scene: THREE.Scene, clock: THREE.Clock) {
  const ribbons: { mesh: THREE.Mesh; offset: number; hue: number }[] = [];
  for (let r = 0; r < 7; r++) {
    const geo = new THREE.PlaneGeometry(8,1.4,100,24);
    const hue = 0.06+r*0.012;
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue,0.85,0.62+r*0.02), side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0,(r-3)*0.7,r*0.05-0.15); mesh.rotation.x = Math.PI*0.08;
    scene.add(mesh); ribbons.push({ mesh, offset: r*1.3, hue });
  }
  return () => {
    const t = clock.getElapsedTime();
    ribbons.forEach(({ mesh, offset, hue }, ri) => {
      const pos = mesh.geometry.attributes.position.array as Float32Array;
      for (let i=0;i<pos.length/3;i++) { const x=pos[i*3]; pos[i*3+1]+=(Math.sin(t*1.1+x*2.2+offset)*0.3+Math.sin(t*0.6+x*4+offset*0.7)*0.12-pos[i*3+1])*0.07; pos[i*3+2]=Math.cos(t*0.8+x*1.8+offset)*0.2; }
      mesh.geometry.attributes.position.needsUpdate = true;
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.4,t*0.12)*(0.5+0.5*Math.sin(t*0.6+ri));
      (mesh.material as THREE.MeshBasicMaterial).color = new THREE.Color().setHSL(hue+Math.sin(t*0.25)*0.025,0.85,0.62);
    });
  };
}

function buildSacredGeo(scene: THREE.Scene, clock: THREE.Clock) {
  const rings: { mesh: THREE.Mesh; rx: number; ry: number; rz: number }[] = [];
  ([
    [1.4,0.014,"#A67C52",0,0,0.45,0],[1.0,0.011,"#D4B896",Math.PI/3,0.35,0,0.22],
    [1.7,0.009,"#C49A6C",Math.PI/5,0.12,0.22,0.32],[0.65,0.016,"#FFD580",Math.PI/2,0.55,0.32,0],
    [2.0,0.007,"#8B6A46",Math.PI/7,0.06,0.16,0.28],[0.4,0.018,"#E8C87A",Math.PI/4,0.7,0.4,0.15],
  ] as [number,number,string,number,number,number,number][]).forEach(([r,t,col,tilt,rx,ry,rz]) => {
    const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(r,t,8,120), mat);
    mesh.rotation.x = tilt; mesh.scale.setScalar(0); scene.add(mesh);
    rings.push({ mesh, rx, ry, rz });
  });
  const dotPts: number[] = [], dotCol: number[] = [];
  for (let l=1;l<=6;l++) { const count=l*8,r=l*0.33,c=new THREE.Color().setHSL(0.08+l*0.01,0.8,0.65); for (let j=0;j<count;j++) { const a=(j/count)*Math.PI*2; dotPts.push(Math.cos(a)*r,Math.sin(a)*r,0); dotCol.push(c.r,c.g,c.b); } }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.Float32BufferAttribute(dotPts,3));
  dg.setAttribute("color",    new THREE.Float32BufferAttribute(dotCol,3));
  const dm = new THREE.PointsMaterial({ size:0.04, vertexColors:true, transparent:true, opacity:0, depthWrite:false });
  const dots = new THREE.Points(dg, dm); scene.add(dots);
  return () => {
    const t = clock.getElapsedTime();
    rings.forEach(({mesh,rx,ry,rz},i) => { mesh.rotation.x+=rx*0.01; mesh.rotation.y+=ry*0.01; mesh.rotation.z+=rz*0.01; const lt=Math.max(0,t-i*0.2); mesh.scale.setScalar(Math.min(1,lt*2)); (mesh.material as THREE.MeshBasicMaterial).opacity=Math.min(0.8,lt*0.4)*(0.5+0.5*Math.sin(t*0.8+i*1.1)); });
    dots.rotation.z = t*0.08; dm.opacity = Math.min(0.7, t*0.3);
  };
}

// ─── ReflectCanvas ────────────────────────────────────────────────────────────
export function ReflectCanvas({ theme, animKey }: { theme: AnimTheme; animKey: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W = el.clientWidth||600, H = el.clientHeight||260;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.setClearColor(0,0);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(50,W/H,0.1,100);
    camera.position.z = 5;
    const clock = new THREE.Clock();
    const builders = [buildSupernova, buildInkBloom, buildCrystalLattice, buildFireflies, buildAurora, buildSacredGeo];
    const tick = builders[theme](scene, clock);
    let id: number;
    const loop = () => { id=requestAnimationFrame(loop); tick(); renderer.render(scene,camera); }; loop();
    const onResize = () => { const w=el.clientWidth,h=el.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize",onResize); cancelAnimationFrame(id); renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, [theme, animKey]);
  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}

// ─── HeroBackground ───────────────────────────────────────────────────────────
export function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.setClearColor(0,0); renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(50,W/H,0.1,200);
    camera.position.set(0,0,9);

    scene.add(new THREE.AmbientLight(0xfff8e8, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffd580, 2.5); keyLight.position.set(4,6,5); scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xc49a6c, 1.5); rimLight.position.set(-5,-3,2); scene.add(rimLight);
    const fillLight = new THREE.PointLight(0xa67c52, 1.8, 20); fillLight.position.set(0,0,4); scene.add(fillLight);

    const orbDefs = [
      { r:1.5,  x:-1.0, y:0.4,  z:0,    color:0xd4a0c8, rough:0.0,  metal:0.1,  opacity:0.55, speed:0.25 },
      { r:1.1,  x:2.2,  y:-0.3, z:-0.5, color:0xc8c0d8, rough:0.0,  metal:0.1,  opacity:0.50, speed:0.18 },
      { r:0.75, x:2.8,  y:1.8,  z:0.5,  color:0xe8e0d0, rough:0.1,  metal:0.2,  opacity:0.65, speed:0.32 },
      { r:0.6,  x:-2.6, y:-1.4, z:0.8,  color:0xd0c8c0, rough:0.05, metal:0.15, opacity:0.60, speed:0.28 },
      { r:0.45, x:0.8,  y:2.4,  z:-0.8, color:0xc8b8e0, rough:0.0,  metal:0.1,  opacity:0.45, speed:0.40 },
    ];
    const orbs: { mesh: THREE.Mesh; ox:number; oy:number; speed:number; phase:number }[] = [];
    orbDefs.forEach((d,i) => {
      const mat = new THREE.MeshPhysicalMaterial({ color:d.color, metalness:d.metal, roughness:d.rough, transmission:0.85, thickness:d.r*1.2, transparent:true, opacity:d.opacity, ior:1.4, reflectivity:0.9, envMapIntensity:1.5 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r,64,64), mat);
      mesh.position.set(d.x,d.y,d.z); scene.add(mesh);
      orbs.push({ mesh, ox:d.x, oy:d.y, speed:d.speed, phase:i*1.1 });
    });

    const ringDefs = [
      { r:3.8, tube:0.012, color:0xc49a6c, rx:Math.PI/2.5, ry:0.2,  rz:0,    opacity:0.55 },
      { r:2.8, tube:0.009, color:0xa67c52, rx:Math.PI/4,   ry:0.5,  rz:0.3,  opacity:0.45 },
      { r:5.0, tube:0.007, color:0xd4b896, rx:Math.PI/3,   ry:-0.3, rz:0.15, opacity:0.35 },
      { r:4.4, tube:0.010, color:0xffd580, rx:Math.PI/6,   ry:0.8,  rz:-0.2, opacity:0.40 },
      { r:1.9, tube:0.015, color:0xc49a6c, rx:Math.PI/1.8, ry:-0.4, rz:0.5,  opacity:0.50 },
    ];
    const rings: { mesh: THREE.Mesh; rotSpeed: THREE.Vector3 }[] = [];
    ringDefs.forEach(d => {
      const mat = new THREE.MeshBasicMaterial({ color:d.color, transparent:true, opacity:d.opacity });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(d.r,d.tube,8,160), mat);
      mesh.rotation.set(d.rx,d.ry,d.rz); scene.add(mesh);
      rings.push({ mesh, rotSpeed: new THREE.Vector3(0.0008,0.0012,0.0006) });
    });

    const glowRings: THREE.Mesh[] = [];
    [2.2, 3.2, 4.2].forEach((r,i) => {
      const mat = new THREE.MeshBasicMaterial({ color:0xffd580, transparent:true, opacity:0.2 });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(r,0.004,4,120), mat);
      mesh.rotation.x = Math.PI/2+i*0.3; mesh.rotation.z = i*0.5; scene.add(mesh); glowRings.push(mesh);
    });

    const DUST = 200;
    const dustPos = new Float32Array(DUST*3), dustVel = new Float32Array(DUST*3);
    for (let i=0;i<DUST;i++) { dustPos[i*3]=(Math.random()-0.5)*16; dustPos[i*3+1]=(Math.random()-0.5)*12; dustPos[i*3+2]=(Math.random()-0.5)*8; dustVel[i*3]=(Math.random()-0.5)*0.004; dustVel[i*3+1]=(Math.random()-0.5)*0.003; dustVel[i*3+2]=(Math.random()-0.5)*0.002; }
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos,3));
    const dustMat = new THREE.PointsMaterial({ color:0xd4b896, size:0.025, transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending });
    scene.add(new THREE.Points(dustGeo, dustMat));

    let mouseX=0, mouseY=0;
    const onMouse = (e: MouseEvent) => { mouseX=(e.clientX/window.innerWidth-0.5)*2; mouseY=(e.clientY/window.innerHeight-0.5)*2; };
    window.addEventListener("mousemove", onMouse);
    let camX=0, camY=0, id: number;
    const clock = new THREE.Clock();

    const loop = () => {
      id = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      camX += (mouseX*0.6 - camX)*0.03; camY += (-mouseY*0.4 - camY)*0.03;
      camera.position.x = camX; camera.position.y = camY; camera.lookAt(0,0,0);
      orbs.forEach(o => { o.mesh.position.x=o.ox+Math.sin(t*o.speed+o.phase)*0.4; o.mesh.position.y=o.oy+Math.cos(t*o.speed*0.7+o.phase)*0.35; o.mesh.position.z=Math.sin(t*o.speed*0.4+o.phase*0.5)*0.3; });
      rings.forEach((r,i) => { r.mesh.rotation.x+=r.rotSpeed.x*(i%2?-1:1); r.mesh.rotation.y+=r.rotSpeed.y; r.mesh.rotation.z+=r.rotSpeed.z*(i%3?-1:1); });
      glowRings.forEach((gr,i) => { gr.rotation.z+=0.001*(i+1); (gr.material as THREE.MeshBasicMaterial).opacity=0.15+0.08*Math.sin(t*0.8+i); });
      const dp = dustGeo.attributes.position.array as Float32Array;
      for (let i=0;i<DUST;i++) { dp[i*3]+=dustVel[i*3]; dp[i*3+1]+=dustVel[i*3+1]; dp[i*3+2]+=dustVel[i*3+2]; if(Math.abs(dp[i*3])>9) dp[i*3]*=-1; if(Math.abs(dp[i*3+1])>7) dp[i*3+1]*=-1; if(Math.abs(dp[i*3+2])>5) dp[i*3+2]*=-1; }
      dustGeo.attributes.position.needsUpdate = true;
      fillLight.intensity = 1.8+0.4*Math.sin(t*0.6);
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => { const w=el.clientWidth,h=el.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("mousemove",onMouse); window.removeEventListener("resize",onResize); cancelAnimationFrame(id); renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
}

// ─── Text utilities ───────────────────────────────────────────────────────────

/** Letter-by-letter animated reveal */
export function RevealText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.025, duration: 0.35, ease: "easeOut" }}
          style={{ display: ch === " " ? "inline" : "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Character-scramble text that resolves to real text */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const { useState, useEffect } = require("react") as typeof import("react");
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  useEffect(() => {
    let frame = 0; const total = 20;
    const iv = setInterval(() => {
      frame++;
      setDisplay(text.split("").map((ch, i) => { if (ch===" ") return " "; if (frame>(i/text.length)*total+6) return ch; return chars[Math.floor(Math.random()*chars.length)]; }).join(""));
      if (frame >= total + text.length) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [text]);
  return <span className={className}>{display}</span>;
}