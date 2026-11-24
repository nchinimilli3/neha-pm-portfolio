import React, { useEffect, useRef, useState } from 'react';
import './rep.css';

/* REP's Apple Watch app rebuilt in React for the case study. Screens, sizes and
   colors follow the SwiftUI source; the lifting figures are a port of REP's own
   FigureSketch shapes, drawn in a 1×1 SVG. Health numbers are simulated. */

type P = [number, number];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const dist = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const moved = (c: P, o: P, d: P, a: number): P => {
  const x = c[0] - o[0], y = c[1] - o[1];
  return [d[0] + x * Math.cos(a) - y * Math.sin(a), d[1] + x * Math.sin(a) + y * Math.cos(a)];
};
const knee = (hip: P, foot: P, thigh: number, shin: number): P => {
  const dx = foot[0] - hip[0], dy = foot[1] - hip[1];
  const d = Math.min(Math.hypot(dx, dy), thigh + shin - 1e-4);
  const a = (thigh * thigh - shin * shin + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(thigh * thigh - a * a, 0));
  return [hip[0] + (a * dx + h * dy) / d, hip[1] + (a * dy - h * dx) / d];
};
const circle = ([x, y]: P, r: number) => `M${x - r},${y}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${2 * r - w}a${r},${r} 0 0 1 ${-r},${-r}v${2 * r - h}a${r},${r} 0 0 1 ${r},${-r}Z`;
const capsule = (a: P, ra: number, b: P, rb: number) => {
  const th = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const al = Math.acos(Math.max(-1, Math.min(1, (ra - rb) / (dist(a, b) || 1e-6))));
  const pts: string[] = [];
  const arc = (c: P, r: number, s: number, e: number) => {
    for (let i = 0; i <= 24; i++) { const t = s + (e - s) * i / 24; pts.push(`${(c[0] + r * Math.cos(t)).toFixed(4)},${(c[1] + r * Math.sin(t)).toFixed(4)}`); }
  };
  arc(b, rb, th - al, th + al);
  arc(a, ra, th + al, th + 2 * Math.PI - al);
  return 'M' + pts.join('L') + 'Z';
};

// behind: drawn first; cut: stroked in the screen color so `top` reads in front; top: filled last.
type Shape = { behind: string[]; cut: string[]; gap: number; top: string[] };
const FIGURES: Record<string, (p: number) => Shape> = {
  squat(p) {
    const h0: P = [.255, .485], k0: P = [.523, .478], f: P = [.446, .721], s0: P = [.381, .297];
    const hip: P = [h0[0] + .19 * Math.sin(p * Math.PI / 2), h0[1] - .282 * p];
    const k = knee(hip, f, dist(h0, k0), dist(k0, f));
    const torso = (q: P) => moved(q, h0, hip, -.55 * p);
    const shoulder = torso(s0);
    const arm = (q: P) => moved(q, s0, shoulder, .8 * p);
    return { behind: [], cut: [], gap: 0, top: [
      capsule(hip, .065, shoulder, .072), circle(torso([.461, .091]), .092),
      capsule(arm([.381, .272]), .045, arm([.787, .27]), .045),
      capsule(hip, .065, k, .045), capsule(k, .045, f, .044), rect(.254, .803, .383, .194, .035)] };
  },
  curl(p) {
    const c = .474, handY = .4387 + .1413 * Math.cos(2.27 * p), barY = handY - .05;
    const body = [rect(c - .087, .25, .174, .221, .01), capsule([c - .057, .294], .08, [c + .057, .294], .08), rect(c - .087, .471, .174, .12, 0)];
    const front = [circle([c, .0865], .0865), rect(c - .106, .591, .212, .04, .005)];
    for (const s of [-1, 1]) {
      const at = (x: number, y: number): P => [c + s * x, y];
      const elbow = at(.1778, .4387);
      body.push(capsule(at(.092, .266), .04, elbow, .04));
      front.push(capsule(elbow, .04, at(.248, handY), .04), capsule(at(.0695, .6375), .049, at(.1165, .7485), .04),
        capsule(at(.1165, .7485), .04, at(.153, .9195), .04), rect(c + s * .38075 - .03825, barY - .133, .0765, .2665, .0265));
    }
    const bar = capsule([.0245, barY], .0235, [2 * c - .0245, barY], .0235);
    return { behind: body, cut: [bar], gap: .036 - .016 * p, top: [bar, ...front] };
  },
  lunge(p) {
    const h0: P = [.478, .6455], fk0: P = [.8125, .66], ff: P = [.814, .9365], bk0: P = [.373, .87], bf: P = [.123, .935];
    const hip: P = [h0[0], h0[1] - .08 * p], up = (q: P) => add(q, [0, hip[1] - h0[1]]);
    const fk = knee(hip, ff, dist(h0, fk0), dist(fk0, ff)), bk = knee(hip, bf, dist(h0, bk0), dist(bk0, bf));
    const elbow = up([.2575, .43]);
    return { behind: [], cut: [], gap: 0, top: [
      circle(up([.508, .099]), .099), capsule(up([.514, .337]), .092, up([.513, .612]), .094),
      capsule(up([.443, .294]), .0445, elbow, .0445), capsule(elbow, .0445, up([.437, .5495]), .0445),
      capsule(hip, .0605, fk, .046), capsule(fk, .046, ff, .046), capsule(hip, .067, bk, .045), capsule(bk, .045, bf, .047)] };
  },
  crunch(p) {
    const back: P = [.334, .596], hip: P = [.469, .592], fs0: P = [.182, .559], k0: P = [.466, .365], f0: P = [.665, .365];
    const upper = (q: P) => moved(q, back, back, -.3 * p);
    const fs = upper(fs0), farArm = (q: P) => moved(upper(q), fs, fs, .6 * p);
    const nearElbow = upper([.3665, .365]), farElbow = farArm([.039, .625]);
    const k = moved(k0, hip, hip, 1.13 * p), f = moved(f0, k0, k, (1.13 - 1.4) * p);
    const nearLeg = [capsule(hip, .055, k, .032), capsule(k, .032, f, .032)];
    return { behind: [capsule(hip, .043, [.6675, .55], .034), capsule([.6675, .55], .034, [.926, .55], .034)], cut: nearLeg, gap: .031, top: [
      circle(upper([.134, .396]), .069), capsule(upper([.2525, .3645]), .0325, nearElbow, .0325), capsule(nearElbow, .0325, upper([.238, .5205]), .0325),
      capsule(farArm([.071, .503]), .032, farElbow, .032), capsule(farElbow, .032, fs, .032), capsule(upper([.214, .567]), .059, back, .065),
      capsule(back, .065, hip, .055), ...nearLeg] };
  }
};

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// REP's PlayfulMotion: a 2.4s smoothstepped rep at 30fps, still when Reduce Motion is on.
export function Figure({ kind, color, size }: { kind: string; color: string; size: number }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0, last = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      if (now - last > 33) {
        last = now;
        const ph = (1 - Math.cos((now - t0) / 2400 * 2 * Math.PI)) / 2;
        setP(ph * ph * (3 - 2 * ph));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const s = FIGURES[kind](p);
  return <svg className="rwFig" viewBox="0 0 1 1" width={size} height={size} aria-hidden="true">
    {s.behind.map((d, i) => <path key={'b' + i} d={d} fill={color}/>)}
    {s.cut.map((d, i) => <path key={'c' + i} d={d} fill="none" stroke="#000" strokeWidth={s.gap * 2} strokeLinejoin="round"/>)}
    {s.top.map((d, i) => <path key={'t' + i} d={d} fill={color}/>)}
  </svg>;
}

type Kind = 'lb' | 'side' | 'assist' | 'added' | 'body';
type Ex = { name: string; load: number; kind: Kind; color: string; fig: string };
type Routine = { name: string; color: string; fig: string; ex: [string, number, Kind][] };
const C = { back: '#c752ff', glutes: '#ff2e87', legs: '#b3ff14', abs: '#64d2ff', rep: '#c4fa26', time: '#ffe620', energy: '#ff4a5c' };
const ROUTINES: Routine[] = [
  { name: 'Back + Biceps', color: C.back, fig: 'curl', ex: [['Assisted Pull-up', 70, 'assist'], ['Back Extension Machine', 0, 'body'], ['Row Machine', 35, 'lb'], ['Bicep Curl Machine', 20, 'lb'], ['Rear Delt Fly Machine', 25, 'lb']] },
  { name: 'Legs', color: C.legs, fig: 'lunge', ex: [['Seated Leg Press', 80, 'lb'], ['Smith Machine Squat', 10, 'side'], ['Hip Adduction', 65, 'lb']] },
  { name: 'Glutes', color: C.glutes, fig: 'squat', ex: [['Hamstring Curl Machine', 35, 'lb'], ['Smith Machine Hip Thrust', 25, 'side'], ['Hip Abduction', 65, 'lb']] }
];
const ABS: Routine = { name: 'Abs', color: C.abs, fig: 'crunch', ex: [['Hanging Ab Crunch', 3, 'added']] };
const toEx = (r: Routine): Ex[] => r.ex.map(([name, load, kind]) => ({ name, load, kind, color: r.color, fig: r.fig }));
const SETS = 4, REPS = 10, REST = 90;
const loadLabel: Record<Kind, string> = { lb: 'Lbs', side: 'Lbs / side', assist: 'Lbs assist', added: 'Lbs added', body: '' };
const editLabel: Record<Kind, string> = { lb: 'Resistance · lb', side: 'Plates · lb per side', assist: 'Assistance · lb', added: 'Added · lb', body: '' };
const num = (n: number) => String(Math.round(n * 10) / 10);
const clock = (s: number, hours = false) => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = String(s % 60).padStart(2, '0');
  return hours ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${Math.floor(s / 60)}:${ss}`;
};

const Check = () => <svg viewBox="0 0 24 24" className="rwIco"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>;
const Icon = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" className="rwIco"><path d={d}/></svg>;
const ICON = {
  x: 'M6 6l12 12M18 6L6 18', pause: 'M8 5v14M16 5v14', resume: 'M19 12a7 7 0 1 1-2-4.9M19 4v4h-4',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  timer: 'M12 8v5l3 2M9 2h6M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', heart: 'M12 21s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.9C19.5 16.4 12 21 12 21z'
};

type Phase = 'home' | 'count' | 'set' | 'saved' | 'rest' | 'abs' | 'finish' | 'summary';
type Logged = { ex: number; load: number; reps: number };

export function RepWatchDemo() {
  const [phase, setPhase] = useState<Phase>('home');
  const [exs, setExs] = useState<Ex[]>([]);
  const [cur, setCur] = useState(0);
  const [log, setLog] = useState<Logged[]>([]);
  const [reps, setReps] = useState(REPS);
  const [count, setCount] = useState(3);
  const [rest, setRest] = useState({ left: REST, total: REST });
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hpage, setHpage] = useState(1);   // 0 = controls, 1 = workout
  const [vpage, setVpage] = useState(0);   // 0 = logger, 1 = metrics, 2 = activity
  const [edit, setEdit] = useState<null | { field: 'load' | 'reps'; value: number }>(null);
  const [list, setList] = useState<null | { title: string; items: Ex[]; pick: boolean }>(null);
  const [absAdded, setAbsAdded] = useState(false);
  const [bpm, setBpm] = useState(112);
  const screen = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const live = ['set', 'saved', 'rest', 'abs', 'finish'].includes(phase);
  const ex = exs[cur];
  const done = (i: number) => log.filter(l => l.ex === i).length;

  // Workout clock, heart rate and the rest timer: one tick for all of them.
  useEffect(() => {
    if (!live || paused) return;
    const t = setInterval(() => {
      setElapsed(e => e + 1);
      setBpm(b => Math.max(96, Math.min(138, b + Math.round(Math.random() * 6 - 3))));
      if (phase === 'rest') setRest(r => ({ ...r, left: r.left - 1 }));
    }, 1000);
    return () => clearInterval(t);
  }, [live, paused, phase]);
  useEffect(() => { if (phase === 'rest' && rest.left <= 0) setPhase('set'); }, [phase, rest.left]);

  useEffect(() => {
    if (phase !== 'count') return;
    if (count === 0) { setPhase('set'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  const start = (r: Routine) => {
    setExs(toEx(r)); setCur(0); setLog([]); setReps(REPS); setElapsed(0); setPaused(false);
    setAbsAdded(false); setHpage(1); setVpage(0); setCount(3); setPhase('count');
  };

  const setDone = () => {
    const next = [...log, { ex: cur, load: ex.load, reps }];
    setLog(next); setPhase('saved');
    setTimeout(() => {
      const left = (i: number) => next.filter(l => l.ex === i).length < SETS;
      const order = exs.map((_, i) => (cur + i) % exs.length);
      const n = order.find(left);
      if (n === undefined) { setPhase(absAdded ? 'finish' : 'abs'); return; }
      setCur(n); setReps(REPS); setRest({ left: REST, total: REST }); setPhase('rest');
    }, 650);
  };

  const addAbs = () => {
    setExs(e => [...e, ...toEx(ABS)]); setCur(exs.length); setReps(REPS); setAbsAdded(true); setPhase('set');
  };

  const undo = () => {
    const last = log[log.length - 1];
    if (!last) return;
    setLog(log.slice(0, -1)); setCur(last.ex); setReps(last.reps); setPhase('set'); setHpage(1);
  };

  const saveEdit = () => {
    if (!edit) return;
    // An edit carries forward for the rest of this workout; sets already logged keep their numbers.
    if (edit.field === 'load') setExs(e => e.map((x, i) => i === cur ? { ...x, load: edit.value } : x));
    else setReps(edit.value);
    setEdit(null);
  };
  const step = (dir: number, crown = false) => setEdit(e => e && {
    ...e, value: Math.max(e.field === 'reps' ? 1 : 0, Math.min(e.field === 'reps' ? 50 : 500, e.value + dir * (e.field === 'reps' ? 1 : crown ? 5 : .5)))
  });

  // The mouse wheel stands in for the Digital Crown.
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    let lastTurn = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2 || el.querySelector('.rwCarousel, .rwList')?.contains(e.target as Node)) return;
      if (edit) { e.preventDefault(); const now = performance.now(); if (now - lastTurn > 70) { lastTurn = now; step(e.deltaY < 0 ? 1 : -1, true); } return; }
      if (!live || hpage !== 1) return;
      const to = Math.max(0, Math.min(2, vpage + (e.deltaY > 0 ? 1 : -1)));
      if (to === vpage) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastTurn > 450) { lastTurn = now; setVpage(to); }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null;
    if (!d || !live || edit || list) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) setHpage(dx > 0 ? 0 : 1);
    else if (Math.abs(dy) > 28 && hpage === 1) setVpage(v => Math.max(0, Math.min(2, v + (dy < 0 ? 1 : -1))));
  };

  const reset = () => { setPhase('home'); setExs([]); setLog([]); setHpage(1); setVpage(0); };
  const cal = Math.round(elapsed * .105);
  const tint = ex?.color ?? C.rep;
  const now = new Date();
  const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;

  let body: React.ReactNode = null;
  if (phase === 'home') body = <div className="rwCarousel">
    <h3 className="rwBrand">REP.</h3>
    {ROUTINES.map(r => <div className="rwCard" key={r.name} style={{ '--c': r.color } as React.CSSProperties}>
      <button type="button" className="rwCardMain" onClick={() => start(r)} aria-label={`Start ${r.name}`}>
        <Figure kind={r.fig} color={r.color} size={48}/>
        <b>{r.name}</b>
      </button>
      <button type="button" className="rwMore" aria-label={`${r.name} exercises`} onClick={() => setList({ title: r.name, items: toEx(r), pick: false })}>•••</button>
    </div>)}
  </div>;
  else if (phase === 'count') {
    const D = 138.6, R = (D - 12.3) / 2, L = 2 * Math.PI * R;
    body = <div className="rwCount" style={{ '--c': exs[0].color } as React.CSSProperties}>
      <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} aria-hidden="true">
        <circle cx={D / 2} cy={D / 2} r={R} className="rwCountTrack" strokeWidth={12.3}/>
        <circle key={count} cx={D / 2} cy={D / 2} r={R} className="rwCountArc" strokeWidth={12.3} strokeDasharray={L} style={{ '--l': L } as React.CSSProperties}/>
      </svg>
      <span aria-live="assertive">{count || ''}</span>
    </div>;
  }
  else if (phase === 'set' || phase === 'saved') {
    const saved = phase === 'saved';
    const n = done(cur);
    const prev = log.filter(l => l.ex === cur).slice(-1)[0];
    body = <div className={`rwSet${saved ? ' isSaved' : ''}`} style={{ '--c': tint } as React.CSSProperties}>
      <div className="rwExRow"><Figure kind={ex.fig} color={tint} size={28}/><b>{ex.name}</b></div>
      <div className="rwDotsRow">
        <span className="rwDots" aria-label={`Set ${Math.min(n + 1, SETS)} of ${SETS}`}>{Array.from({ length: SETS }, (_, i) => <i key={i} className={i < n ? (saved && i === n - 1 ? 'on pop' : 'on') : ''}/>)}</span>
        {saved ? <em>Saved locally</em> : ex.kind !== 'body' && <em>Last: {num(prev?.load ?? ex.load)}lbs</em>}
      </div>
      <div className="rwVals">
        <button type="button" disabled={saved || ex.kind === 'body'} onClick={() => setEdit({ field: 'load', value: ex.load })} aria-label={`Weight ${ex.kind === 'body' ? 'bodyweight' : num(ex.load) + ' pounds'}. Edit`}>
          {ex.kind === 'body' ? <><strong className="isWord">Bodyweight</strong><small>&nbsp;</small></> : <><strong>{num(ex.load)}</strong><small>{loadLabel[ex.kind]}</small></>}
        </button>
        <button type="button" disabled={saved} onClick={() => setEdit({ field: 'reps', value: reps })} aria-label={`${reps} reps. Edit`}><strong>{reps}</strong><small>Reps</small></button>
      </div>
      {saved ? <div className="rwPill isLogged"><Check/>Set logged</div>
        : <button type="button" className="rwPill" onClick={setDone}><Check/>Set Done</button>}
    </div>;
  }
  else if (phase === 'rest') body = <div className="rwRest" style={{ '--c': tint } as React.CSSProperties}>
    <p className="rwRestLabel"><Icon d={ICON.timer}/>Rest</p>
    <strong className="rwRestTime">{clock(Math.max(0, rest.left))}</strong>
    <div className="rwBar"><i style={{ width: `${(1 - rest.left / rest.total) * 100}%` }}/></div>
    <p className="rwRestNext"><b>{ex.name}</b><span>{ex.kind === 'body' ? 'Next: bodyweight' : `Next: ${num(ex.load)} lb`}</span></p>
    <div className="rwRestBtns">
      <button type="button" className="rwPill" onClick={() => setPhase('set')}>Skip Rest</button>
      <button type="button" className="rwRound" aria-label="Add 30 seconds" onClick={() => setRest(r => ({ left: r.left + 30, total: r.total + 30 }))}><Icon d={ICON.plus}/></button>
    </div>
  </div>;
  else if (phase === 'abs') body = <div className="rwPrompt" style={{ '--c': C.abs } as React.CSSProperties}>
    <Figure kind="crunch" color={C.abs} size={54}/>
    <h4>Add Abs?</h4>
    <button type="button" className="rwPill" onClick={addAbs}>Add Abs</button>
    <button type="button" className="rwPill isQuiet" onClick={() => setPhase('finish')}>Not Today</button>
  </div>;
  else if (phase === 'finish') body = <div className="rwPrompt" style={{ '--c': C.rep } as React.CSSProperties}>
    <span className="rwBigCheck"><Check/></span>
    <h4>Ready to finish</h4>
    <p>{log.length} sets logged</p>
    <button type="button" className="rwPill" onClick={() => setPhase('summary')}>End Workout</button>
  </div>;
  else if (phase === 'summary') body = <div className="rwSummary">
    <h4>Workout complete</h4>
    <dl>
      <div style={{ '--c': C.time } as React.CSSProperties}><dt>Total Time</dt><dd>{clock(elapsed, true)}</dd></div>
      <div style={{ '--c': C.energy } as React.CSSProperties}><dt>Active Calories</dt><dd>{cal}</dd></div>
      <div style={{ '--c': C.rep } as React.CSSProperties}><dt>Sets</dt><dd>{log.length}</dd></div>
      <div style={{ '--c': C.rep } as React.CSSProperties}><dt>Reps</dt><dd>{log.reduce((s, l) => s + l.reps, 0)}</dd></div>
    </dl>
    <button type="button" className="rwPill" style={{ '--c': C.rep } as React.CSSProperties} onClick={reset}>Done</button>
  </div>;

  const controls = <div className="rwControls">
    {paused && <p className="rwPaused">Paused</p>}
    <div className="rwCtlGrid">
      {([
        ['End', ICON.x, '#ff453a', () => setPhase('summary'), false],
        [paused ? 'Resume' : 'Pause', paused ? ICON.resume : ICON.pause, tint, () => setPaused(p => !p), false],
        ['Exercise', ICON.list, tint, () => setList({ title: 'Exercise', items: exs, pick: true }), false],
        ['Undo Set', ICON.undo, '#ffffff', undo, log.length === 0]
      ] as [string, string, string, () => void, boolean][]).map(([label, d, color, fn, off]) =>
        <div className="rwCtl" key={label} style={{ '--c': color } as React.CSSProperties}>
          <button type="button" onClick={fn} disabled={off} aria-label={label}><Icon d={d}/></button>
          <span>{label}</span>
        </div>)}
    </div>
  </div>;

  const metrics = <div className="rwMetrics">
    <strong className="rwMetTime">{clock(elapsed, true)}</strong>
    <p><b>{cal}</b><span>ACTIVE CAL</span></p>
    <p><b>{bpm}</b><span>BPM</span><svg viewBox="0 0 24 24" className={`rwHeart${paused ? '' : ' isBeating'}`}><path d={ICON.heart}/></svg></p>
  </div>;

  const rings = [['Move', '#fa114f', Math.min(1, (180 + cal) / 500), `${180 + cal}/500`, 'CAL'], ['Exercise', '#92e82a', Math.min(1, (12 + elapsed / 60) / 30), `${Math.floor(12 + elapsed / 60)}/30`, 'MIN'], ['Stand', '#1eeaef', 7 / 12, '7/12', 'HRS']] as const;
  const activity = <div className="rwActivity">
    <svg viewBox="0 0 80 80" aria-hidden="true">{rings.map(([, c, k], i) => {
      const r = 34 - i * 11, L = 2 * Math.PI * r;
      return <g key={c}><circle cx="40" cy="40" r={r} stroke={c} strokeOpacity=".25" strokeWidth="9" fill="none"/><circle cx="40" cy="40" r={r} stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={`${L * k} ${L}`} transform="rotate(-90 40 40)"/></g>;
    })}</svg>
    <ul>{rings.map(([name, c, , v, u]) => <li key={name} style={{ color: c }}><span>{name}</span><b>{v}<small>{u}</small></b></li>)}</ul>
  </div>;

  const loggerPages = phase === 'set' || phase === 'saved' || phase === 'rest';
  return <div className="rwStage">
    <div className="rwWatch" style={{ '--c': tint } as React.CSSProperties}>
      <span className="rwCrown" aria-hidden="true"/><span className="rwSide" aria-hidden="true"/>
      <div ref={screen} className="rwScreen" onPointerDown={onDown} onPointerUp={onUp} aria-label="REP on Apple Watch, interactive" role="group">
        <span className="rwClock" aria-hidden="true">{time}</span>
        <div className={`rwPages${live ? ' isLive' : ''}`} style={{ transform: `translateX(${live ? -hpage * 50 : 0}%)` }}>
          {live && <section className="rwPage" aria-hidden={hpage !== 0} inert={hpage !== 0 ? true : undefined}>{controls}</section>}
          <section className="rwPage" aria-hidden={live && hpage !== 1} inert={live && hpage !== 1 ? true : undefined}>
            <div className="rwVPages" style={{ transform: `translateY(${loggerPages ? -vpage * 100 : 0}%)` }}>
              <div className="rwVPage">{body}</div>
              {loggerPages && <><div className="rwVPage">{metrics}</div><div className="rwVPage">{activity}</div></>}
            </div>
            {loggerPages && <nav className="rwVDots" aria-label="Workout pages">{[0, 1, 2].map(i => <button type="button" key={i} aria-label={['Logger', 'Metrics', 'Activity'][i]} aria-current={vpage === i} onClick={() => setVpage(i)}/>)}</nav>}
          </section>
        </div>
        {live && <nav className="rwHDots" aria-label="Workout views">{[0, 1].map(i => <button type="button" key={i} aria-label={i ? 'Workout' : 'Controls'} aria-current={hpage === i} onClick={() => setHpage(i)}/>)}</nav>}
        {edit && ex && <div className="rwSheet rwEditor" style={{ '--c': tint } as React.CSSProperties}>
          <button type="button" className="rwClose" aria-label="Cancel" onClick={() => setEdit(null)}><Icon d={ICON.x}/></button>
          <p>{edit.field === 'reps' ? 'Repetitions' : editLabel[ex.kind]}</p>
          <div className="rwEditRow">
            <button type="button" aria-label="Decrease" onClick={() => step(-1)}><Icon d={ICON.minus}/></button>
            <strong aria-live="polite">{num(edit.value)}</strong>
            <button type="button" aria-label="Increase" onClick={() => step(1)}><Icon d={ICON.plus}/></button>
          </div>
          <button type="button" className="rwPill" onClick={saveEdit}>Save</button>
        </div>}
        {list && <div className="rwSheet rwList">
          <button type="button" className="rwClose" aria-label="Close" onClick={() => setList(null)}><Icon d={ICON.x}/></button>
          <p>{list.title}</p>
          <ul>{list.items.map((x, i) => <li key={x.name} style={{ '--c': x.color } as React.CSSProperties}>
            <button type="button" disabled={!list.pick} onClick={() => { setCur(i); setReps(REPS); setPhase('set'); setHpage(1); setVpage(0); setList(null); }}>
              <b>{x.name}</b><span>{x.kind === 'body' ? 'Bodyweight' : `${num(x.load)} ${loadLabel[x.kind].toLowerCase()}`} · {list.pick ? `${done(i)}/${SETS} sets` : `${SETS}×${REPS}`}</span>
            </button>
          </li>)}</ul>
        </div>}
      </div>
    </div>
    <p className="rwHint">{live ? 'Swipe right for controls. Scroll to page through metrics.' : 'Tap a routine to start a workout. Scroll to see all three.'}</p>
  </div>;
}
