import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import RollingVehicle from './RollingVehicle';
import {Landmark} from './CommuteArt';
import './commute-model-lab.css';

/* The model section used to *describe* the simulation: a formula, a sentence
   saying it runs 1,000 times, and three pre-baked bars. This runs it instead.
   Every number on screen is produced by the sampler below, in the browser, from
   the leg ranges observed across the 8-week test, and both routes are simulated
   every morning. The bus is only worth planning around if the train it falls
   back to still makes 9:00. Seeds are fixed per departure so the case reads the
   same for every visitor. */

/* mulberry32: small, fast, and deterministic from a seed. */
function rng(seed: number){
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Triangular draw: the honest shape for "usually 19, sometimes 16, sometimes 23". */
const tri = (lo: number, mode: number, hi: number, u: number) => {
  const c = (mode - lo) / (hi - lo);
  return u < c
    ? lo + Math.sqrt(u * (hi - lo) * (mode - lo))
    : hi - Math.sqrt((1 - u) * (hi - lo) * (hi - mode));
};

type Leg = {k: string; name: string; short: string; art: string; src: string; feed: string; lo: number; hi: number; draw: (u: number) => number};
type Route = {
  k: 'nl' | 'bart';
  name: string;
  role: string;
  legs: Leg[];
  disrupt: {p: number; mean: number; label: string; src: string};
  vehicle: {src: string; w: number; h: number; wheels: {cx: number; cy: number; r: number}[]; alt: string};
};

const MEDIA = import.meta.env.BASE_URL + 'project-media/';

/* Two real plans, each with its own legs and its own way of going wrong. The
   bus is the faster one on a good morning; the train is the one with another
   train five to six minutes behind it. */
const ROUTES: Route[] = [
  {
    k: 'nl',
    name: 'NL bus',
    role: 'Faster when it runs',
    legs: [
      {k: 'walk',  name: 'Walk to the stop', art: 'sidewalk', short: 'walk',  src: 'HealthKit pace · Google Routes', feed: 'HealthKit · Routes', lo: 5,  hi: 9,  draw: u => tri(5, 7, 9, u)},
      {k: 'wait',  name: 'Wait at the stop', art: 'stop', short: 'wait',  src: '511 GTFS-Realtime',              feed: '511 realtime', lo: 0,  hi: 7,  draw: u => 7 * Math.pow(u, 1.7)},
      {k: 'ride',  name: 'Bridge ride', art: 'bridge',      short: 'ride',  src: '511 live NL · 511 traffic',      feed: '511 live NL', lo: 18, hi: 30, draw: u => tri(18, 21, 30, u)},
      {k: 'final', name: 'Final walk',       art: 'street', short: 'final', src: 'HealthKit pace · Google Routes', feed: 'HealthKit · Routes', lo: 4,  hi: 7,  draw: u => tri(4, 5, 7, u)}
    ],
    /* One bus in ten is the bad one, and the next is half an hour behind. */
    disrupt: {p: 0.10, mean: 26, label: 'missed it, or the bridge backed up', src: '511 traffic · WeatherKit'},
    vehicle: {src: `${MEDIA}ac-transit-nl-transbay-bus.svg`, w: 1280, h: 400, wheels: [{cx: 354, cy: 255, r: 54}, {cx: 996, cy: 255, r: 54}], alt: ''}
  },
  {
    k: 'bart',
    name: 'BART',
    role: 'The fallback the alarm has to survive',
    legs: [
      {k: 'walk',  name: 'Walk to the station', art: 'sidewalk', short: 'walk',  src: 'HealthKit pace · Google Routes', feed: 'HealthKit · Routes', lo: 16, hi: 23, draw: u => tri(16, 19, 23, u)},
      {k: 'wait',  name: 'Platform wait', art: 'station',       short: 'wait',  src: '511 GTFS-Realtime',              feed: '511 realtime', lo: 0,  hi: 6,  draw: u => 6 * Math.pow(u, 1.8)},
      {k: 'ride',  name: 'The ride', art: 'tunnel',            short: 'ride',  src: '511 live BART',                  feed: '511 live BART', lo: 11, hi: 13, draw: u => 11 + 1.6 * u},
      {k: 'final', name: 'Final walk',          art: 'street', short: 'final', src: 'HealthKit pace · Google Routes', feed: 'HealthKit · Routes', lo: 6,  hi: 9,  draw: u => tri(6, 7, 9, u)}
    ],
    /* Smaller failures, more often: one train missed costs five or six minutes. */
    disrupt: {p: 0.15, mean: 13, label: 'delay on the line', src: '511 live BART · WeatherKit'},
    vehicle: {src: `${MEDIA}bart-train.webp`, w: 2172, h: 418, wheels: [171, 465, 1724, 2009].map(cx => ({cx, cy: 375, r: 44})), alt: ''}
  }
];

export const ROUTINE = 48;       // learned getting-ready time, minutes
const DEADLINE = 9 * 60;  // 9:00, in minutes past midnight
const TARGET = 0.9;       // a departure has to clear this to be allowed
const N = 1000;

/* Three candidate departures. One seed each, shared by both routes. */
export const CANDIDATES = [
  {leave: 8 * 60 + 6,  seed: 250},
  {leave: 8 * 60 + 12, seed: 421},
  {leave: 8 * 60 + 18, seed: 916}
];

export const clock = (mins: number) => {
  const m = Math.round(mins);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
};

type Sample = {parts: number[]; delay: number; arrival: number; late: boolean};

function sampleMorning(route: Route, leave: number, r: () => number): Sample {
  const parts = route.legs.map(l => l.draw(r()));
  const delay = r() < route.disrupt.p ? -route.disrupt.mean * Math.log(1 - r()) : 0;
  const arrival = leave + parts.reduce((a, b) => a + b, 0) + delay;
  return {parts, delay, arrival, late: arrival > DEADLINE};
}

type RunResult = {arrivals: number[]; onTime: number; p50: number; p90: number; worst: number};

function runSim(route: Route, leave: number, seed: number): RunResult {
  const r = rng(seed);
  const arrivals: number[] = [];
  for (let i = 0; i < N; i++) arrivals.push(sampleMorning(route, leave, r).arrival);
  const sorted = [...arrivals].sort((a, b) => a - b);
  return {
    arrivals,
    onTime: arrivals.filter(a => a <= DEADLINE).length / N,
    p50: sorted[Math.floor(N * 0.5)],
    p90: sorted[Math.floor(N * 0.9)],
    worst: sorted[N - 1]
  };
}

const BIN_LO = 8 * 60 + 36, BIN_HI = 9 * 60 + 12, BIN_N = BIN_HI - BIN_LO;
const binOf = (arrival: number) => Math.min(BIN_N - 1, Math.max(0, Math.floor(arrival) - BIN_LO));

/* The arrival equation, drawn to scale: every leg is as wide as the minutes it
   drew, so the picture and the arithmetic are the same object. */
function JourneyStrip({route, leave, one, revealed}: {
  route: Route; leave: number; one: Sample | null; revealed: number;
}){
  const parts = one ? one.parts : route.legs.map(l => (l.lo + l.hi) / 2);
  const delay = one && revealed > route.legs.length ? one.delay : 0;
  const total = parts.reduce((a, b) => a + b, 0) + delay;
  const arrival = leave + total;
  const landed = !!one && revealed > route.legs.length;
  return <div className={`mlabJourney${one ? ' isSequencing' : ''}${landed ? ' isLanded' : ''}${one && one.late ? ' is-late' : ''}`}
    role="img"
    aria-label={one
      ? `Leaving at ${clock(leave)} by ${route.name}: ${route.legs.map((l, i) => `${l.name} ${one.parts[i].toFixed(1)} minutes`).join(', ')}${one.delay ? `, plus ${one.delay.toFixed(0)} minutes lost to ${route.disrupt.label}` : ''}, arriving ${clock(arrival)}`
      : 'The arrival equation, drawn to scale'}>

    <p className={`mlabRisk${landed ? ' isVisible' : ''}`}>
      <b>{Math.round(route.disrupt.p * 10)} morning{Math.round(route.disrupt.p * 10) === 1 ? '' : 's'} in 10</b>
      {route.disrupt.label}
    </p>

    <div className="mlabTrip">
      <div className="mlabStop is-start">
        <Landmark name="home" label="Home"/>
        <b>{clock(leave)}</b>
        <em>leave home</em>
      </div>

      {route.legs.map((l, i) => {
        const lit = revealed > i;
        const at = ((parts[i] - l.lo) / (l.hi - l.lo)) * 100;
        return <div key={l.k} className={`mlabLeg is-${l.k}${lit ? ' isLit' : ''}`} style={{'--m': parts[i]} as React.CSSProperties}>
          <span className="mlabLegVal">{lit ? parts[i].toFixed(1) : '·'}<u>{lit ? 'min' : ''}</u></span>
          <Landmark name={l.art} label={l.name}/>
          <span className="mlabLegBar"><i style={{'--at': `${Math.max(0, Math.min(100, at))}%`} as React.CSSProperties}/></span>
          <span className="mlabLegName">{l.name}</span>
          <span className="mlabLegSrc"><b>{l.lo}–{l.hi} min</b></span>
        </div>;
      })}

      {delay > 0 && <div className="mlabLeg is-delay isLit" style={{'--m': delay} as React.CSSProperties}>
        <span className="mlabLegVal">+{delay.toFixed(0)}<u>min</u></span>
        <span className="mlabLegBar"><i/></span>
        <span className="mlabLegName">{route.disrupt.label}</span>
      </div>}

      <div className={`mlabStop is-end${landed ? ' isLanded' : ''}`}>
        <Landmark name="tower" label="The office"/>
        <b>{landed ? clock(arrival) : '·'}</b>
        <em>{landed ? (one!.late ? 'missed 9:00' : 'made it') : 'deadline 9:00'}</em>
      </div>
    </div>

  </div>;
}

/* One route's run: its vehicle crossing as the mornings pile up, the arrivals
   stacking into a distribution, and the verdict the constraint produces. */
function RouteRun({route, leave, seed, drawn, binding, revealIndex}: {
  route: Route; leave: number; seed: number; drawn: number; binding: boolean; revealIndex: number;
}){
  const result = useMemo(() => runSim(route, leave, seed), [route, leave, seed]);
  const full = useMemo(() => {
    const b = new Array(BIN_N).fill(0);
    result.arrivals.forEach(a => b[binOf(a)]++);
    return b;
  }, [result]);
  const peak = Math.max(...full);
  const shown = useMemo(() => {
    if (drawn >= N) return full;
    const b = new Array(BIN_N).fill(0);
    for (let i = 0; i < drawn; i++) b[binOf(result.arrivals[i])]++;
    return b;
  }, [drawn, full, result]);

  const done = drawn >= N;
  const live = drawn ? result.arrivals.slice(0, drawn).filter(a => a <= DEADLINE).length / drawn : 0;
  const pct = Math.round((done ? result.onTime : live) * 100);
  const safe = result.onTime >= TARGET;

  return <div className={`mlabRoute is-${route.k}${binding ? ' isBinding' : ''}`}
    style={{'--route-index': revealIndex} as React.CSSProperties}>
    <div className="mlabRouteHead">
      <div className="mlabRouteId">
        <span className="mlabRouteArt" style={{'--p': `${(drawn / N) * 100}%`} as React.CSSProperties}>
          <RollingVehicle {...route.vehicle} moving={!done}/>
        </span>
        <div><b>{route.name}</b></div>
      </div>
      <div className={`mlabPct${done ? (safe ? ' is-safe' : ' is-bad') : ''}`}>
        <strong>{pct}<u>%</u></strong>
        <span>reach 9:00</span>
      </div>
    </div>

    <div className="mlabChart" role="img" aria-label={`${route.name}: ${Math.round(result.onTime * 100)} percent of 1,000 simulated mornings arrive by 9:00. Typical arrival ${clock(result.p50)}, nine in ten by ${clock(result.p90)}.`}>
      <div className="mlabBars">
        {shown.map((count, i) => <i
          key={i}
          className={BIN_LO + i > DEADLINE ? 'is-late' : ''}
          style={{'--h': `${peak ? (count / peak) * 100 : 0}%`} as React.CSSProperties}
        />)}
        <span className="mlabCut" style={{'--x': `${((DEADLINE - BIN_LO) / BIN_N) * 100}%`} as React.CSSProperties}><b>9:00</b></span>
      </div>
      <div className="mlabAxis"><span>8:36</span><span>8:48</span><span>9:00</span><span>9:12+</span></div>
    </div>

    <dl className="mlabFacts">
      <div><dt>typical arrival</dt><dd>{clock(result.p50)}</dd></div>
      <div><dt>9 in 10 by</dt><dd>{clock(result.p90)}</dd></div>
    </dl>

  </div>;
}

/* Each step owns its own viewport, so nothing animates off-screen: a step
   arms the first time it is actually being read, and stays armed after. */
function useInView(){
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){ setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting){ setSeen(true); io.disconnect(); }
    }, {rootMargin: '0px 0px -25% 0px'});
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

export default function CommuteModelLab(){
  const reduced = useRef(false);
  const [step1Ref, step1In] = useInView();
  const [step2Ref, step2In] = useInView();
  const [step3Ref, step3In] = useInView();

  const [pick, setPick] = useState(1);        // which departure
  const [lane, setLane] = useState(0);        // which route the single morning uses
  const [one, setOne] = useState<Sample | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [drawn, setDrawn] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const cand = CANDIDATES[pick];
  const route = ROUTES[lane];
  const done = drawn >= N;

  /* One morning, drawn in front of you, so the formula stops being notation. */
  const sampleOne = useCallback((seed?: number) => {
    const s = sampleMorning(route, cand.leave, rng(seed ?? (Date.now() & 0xffff)));
    setOne(s);
    if (reduced.current){
      setRevealed(route.legs.length + 1);
      return;
    }
    setRevealed(0);
    let i = 0;
    const tick = () => {
      i++;
      setRevealed(i);
      if (i <= route.legs.length) window.setTimeout(tick, 420);
    };
    window.setTimeout(tick, 160);
  }, [route, cand]);

  /* The 1,000-morning loop, animated by batches so it reads as accumulation. */
  const runAll = useCallback(() => {
    setRunKey(k => k + 1);
    if (reduced.current){ setDrawn(N); return; }
    setDrawn(0);
    let n = 0;
    const step = () => {
      n = Math.min(N, n + 24);
      setDrawn(n);
      if (n < N) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /* Step 1 draws its morning once the step itself is on screen. */
  useEffect(() => {
    if (!step1In) return;
    sampleOne(7); // a fixed first morning, so the opening read is the same for everyone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step1In, lane]);

  /* Step 2 waits for its own viewport before the 1,000 mornings start piling up. */
  useEffect(() => {
    if (!step2In) return;
    const t = window.setTimeout(runAll, reduced.current ? 0 : 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step2In, pick]);

  return <div className="mlab">
    <header className="mlabHead">
      <h2>How Commute chooses the alarm each morning.</h2>
      <p>The latest departure whose fallback still clears 90%. One inspectable run, from my own commute.</p>
    </header>

    {/* ── 1. one morning ─────────────────────────────────────────── */}
    <section ref={step1Ref as React.RefObject<HTMLElement>} className={`mlabStep${step1In ? ' isInView' : ''}`}>
      <div className="mlabStepHead">
        <b>1</b>
        <div>
          <strong>Build one possible morning</strong>
        </div>
        <div className="mlabStepTools">
          <div className="mlabPicker" role="group" aria-label="Route to sample">
            {ROUTES.map((r, i) => <button key={r.k} type="button" aria-pressed={i === lane} onClick={() => setLane(i)}>{r.name}</button>)}
          </div>
          <button type="button" className="mlabGhostBtn mlabDrawBtn" onClick={() => sampleOne()}>Draw another ↻</button>
        </div>
      </div>

      <JourneyStrip route={route} leave={cand.leave} one={one} revealed={revealed}/>
    </section>

    {/* ── 2. the loop, on both routes ────────────────────────────── */}
    <section ref={step2Ref as React.RefObject<HTMLElement>} className={`mlabStep${step2In ? ' isInView' : ''}`}>
      <div className="mlabStepHead">
        <b>2</b>
        <div>
          <strong>Test the plan and its fallback</strong>
        </div>
        <div className="mlabStepTools">
          <div className="mlabPicker" role="group" aria-label="Candidate departure time">
            {CANDIDATES.map((c, i) => <button key={c.leave} type="button" aria-pressed={i === pick} onClick={() => setPick(i)}>
              leave {clock(c.leave)}
            </button>)}
          </div>
          {/* Always rendered, so finishing a run does not shift the layout. */}
          <button type="button" className="mlabGhostBtn" onClick={runAll} disabled={!done}>Run again ↻</button>
        </div>
      </div>

      <p className="mlabRunCount" aria-live="polite">
        <b>{Math.min(drawn, N).toLocaleString()}</b> / 1,000 mornings simulated per route
      </p>

      <div key={runKey} className={`mlabRoutes${step2In ? ' isSequenced' : ''}`}>
        {ROUTES.map((r, i) => <RouteRun
          key={r.k} route={r} leave={cand.leave} seed={cand.seed} drawn={drawn} binding={i === 1} revealIndex={i}
        />)}
      </div>

    </section>

    {/* ── 3. one answer ──────────────────────────────────────────── */}
    <section ref={step3Ref as React.RefObject<HTMLElement>} className={`mlabStep mlabStepLast${step3In ? ' isInView' : ''}`}>
      <div className="mlabStepHead">
        <b>3</b>
        <div>
          <strong>Choose the latest qualifying departure</strong>
        </div>
      </div>

      {/* The search, not a beauty contest: walk later until the fallback
          breaks, then take the one before. Rows in time order with the margin
          over the 90% rule in its own column. The margin going +5, +1, -27 is
          why 8:18 dies, and taking +1 over +5 is the "sleep, not safety margin"
          decision shown rather than asserted. */}
      <table className="mlabSearch">
        <thead>
          <tr>
            <th>Leave home</th><th>Bus</th><th>Train <small>fallback</small></th>
            <th>Margin over 90%</th><th>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {CANDIDATES.map(c => {
            const bart = runSim(ROUTES[1], c.leave, c.seed);
            const nl = runSim(ROUTES[0], c.leave, c.seed);
            const train = Math.round(bart.onTime * 100);
            const ok = bart.onTime >= TARGET;
            const latest = ok && !CANDIDATES.some(o => o.leave > c.leave && runSim(ROUTES[1], o.leave, o.seed).onTime >= TARGET);
            const margin = train - Math.round(TARGET * 100);
            return <tr key={c.leave} className={`${ok ? '' : 'is-out'}${latest ? ' is-pick' : ''}`}>
              <th scope="row">{clock(c.leave)}{latest && <em>chosen</em>}</th>
              <td>{Math.round(nl.onTime * 100)}%</td>
              <td className="mlabKeyCol">{train}%</td>
              <td className="mlabMargin">{margin > 0 ? `+${margin}` : margin}</td>
              <td>{latest ? 'Last one the fallback survives.'
                   : ok ? 'Safe, six minutes of sleep lost.'
                        : 'Fallback misses 9:00.'}</td>
            </tr>;
          })}
        </tbody>
      </table>

      {/* Steps 1 and 2 would look the same in a spreadsheet. These three are
          the decisions that make it a product rather than an analysis. */}
      {/* Each call gets the number from the table that proves it, so the
          three read as evidence pulled off the rows above rather than three
          paragraphs parked underneath them. */}
      <p className="mlabDecisionNote"><b>Product call</b> Take the last departure the fallback survives. Margin above 90% is sleep paid for.</p>

    </section>
  </div>;
}
