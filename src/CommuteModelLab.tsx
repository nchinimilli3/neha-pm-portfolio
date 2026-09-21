import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import RollingVehicle from './RollingVehicle';
import './commute-model-lab.css';

/* The model section used to *describe* the simulation: a formula, a sentence
   saying it runs 1,000 times, and three pre-baked bars. This runs it instead.
   Every number on screen is produced by the sampler below, in the browser, from
   the leg ranges observed across the 10-week test, and both routes are simulated
   every morning — the bus is only worth planning around if the train it falls
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

type Leg = {k: string; name: string; short: string; src: string; lo: number; hi: number; draw: (u: number) => number};
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
      {k: 'walk',  name: 'Walk to the stop', short: 'walk',  src: 'HealthKit pace · Google Routes', lo: 5,  hi: 9,  draw: u => tri(5, 7, 9, u)},
      {k: 'wait',  name: 'Wait at the stop', short: 'wait',  src: '511 GTFS-Realtime',              lo: 0,  hi: 7,  draw: u => 7 * Math.pow(u, 1.7)},
      {k: 'ride',  name: 'Bridge ride',      short: 'ride',  src: '511 live NL · 511 traffic',      lo: 18, hi: 30, draw: u => tri(18, 21, 30, u)},
      {k: 'final', name: 'Final walk',       short: 'final', src: 'HealthKit pace · Google Routes', lo: 4,  hi: 7,  draw: u => tri(4, 5, 7, u)}
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
      {k: 'walk',  name: 'Walk to the station', short: 'walk',  src: 'HealthKit pace · Google Routes', lo: 16, hi: 23, draw: u => tri(16, 19, 23, u)},
      {k: 'wait',  name: 'Platform wait',       short: 'wait',  src: '511 GTFS-Realtime',              lo: 0,  hi: 6,  draw: u => 6 * Math.pow(u, 1.8)},
      {k: 'ride',  name: 'The ride',            short: 'ride',  src: '511 live BART',                  lo: 11, hi: 13, draw: u => 11 + 1.6 * u},
      {k: 'final', name: 'Final walk',          short: 'final', src: 'HealthKit pace · Google Routes', lo: 6,  hi: 9,  draw: u => tri(6, 7, 9, u)}
    ],
    /* Smaller failures, more often: one train missed costs five or six minutes. */
    disrupt: {p: 0.15, mean: 13, label: 'delay on the line', src: '511 live BART · WeatherKit'},
    vehicle: {src: `${MEDIA}bart-train.webp`, w: 2172, h: 418, wheels: [171, 465, 1724, 2009].map(cx => ({cx, cy: 375, r: 44})), alt: ''}
  }
];

const ROUTINE = 48;       // learned getting-ready time, minutes
const DEADLINE = 9 * 60;  // 9:00, in minutes past midnight
const TARGET = 0.9;       // a departure has to clear this to be allowed
const N = 1000;

/* Three candidate departures. One seed each, shared by both routes. */
const CANDIDATES = [
  {leave: 8 * 60 + 6,  seed: 250},
  {leave: 8 * 60 + 12, seed: 421},
  {leave: 8 * 60 + 18, seed: 916}
];

const clock = (mins: number) => {
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

/* One route's run: its vehicle crossing as the mornings pile up, the arrivals
   stacking into a distribution, and the verdict the constraint produces. */
function RouteRun({route, leave, seed, drawn, binding}: {
  route: Route; leave: number; seed: number; drawn: number; binding: boolean;
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

  return <div className={`mlabRoute is-${route.k}${binding ? ' isBinding' : ''}`}>
    <div className="mlabRouteHead">
      <div className="mlabRouteId">
        <span className="mlabRouteArt" style={{'--p': `${(drawn / N) * 100}%`} as React.CSSProperties}>
          <RollingVehicle {...route.vehicle} moving={!done}/>
        </span>
        <div><b>{route.name}</b><em>{route.role}</em></div>
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
      <div><dt>worst of 1,000</dt><dd>{clock(result.worst)}</dd></div>
    </dl>

    <p className={`mlabVerdict${safe ? ' is-safe' : ' is-bad'}`}>
      {binding
        ? safe ? 'Clears 90%, so this departure is allowed.' : 'Below 90%, so this departure is thrown out.'
        : safe ? 'Also clears 90%, and lands earlier — so this is the one to ride.' : 'Below 90% on its own.'}
    </p>
  </div>;
}

export default function CommuteModelLab(){
  const hostRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const reduced = useRef(false);

  const [pick, setPick] = useState(1);        // which departure
  const [lane, setLane] = useState(0);        // which route the single morning uses
  const [one, setOne] = useState<Sample | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [drawn, setDrawn] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const cand = CANDIDATES[pick];
  const route = ROUTES[lane];
  const done = drawn >= N;

  /* Both routes, every morning. The constraint binds on the fallback. */
  const runs = useMemo(() => ROUTES.map(r => ({route: r, ...runSim(r, cand.leave, cand.seed)})), [cand]);
  const fallback = runs[1];                                   // BART
  const allowed = fallback.onTime >= TARGET;
  const ride = allowed && runs[0].onTime >= TARGET && runs[0].p50 < fallback.p50 ? runs[0] : fallback;

  const say = useCallback((line: string) => setLog(l => [...l.slice(-8), line]), []);

  /* One morning, drawn in front of you, so the formula stops being notation. */
  const sampleOne = useCallback((seed?: number) => {
    const s = sampleMorning(route, cand.leave, rng(seed ?? (Date.now() & 0xffff)));
    setOne(s);
    if (reduced.current){
      setRevealed(route.legs.length + 1);
      say(`  one ${route.k} morning -> ${clock(s.arrival)} ${s.late ? 'LATE' : 'on time'}`);
      return;
    }
    setRevealed(0);
    let i = 0;
    const tick = () => {
      i++;
      setRevealed(i);
      if (i <= route.legs.length) window.setTimeout(tick, 250);
      else say(`  one ${route.k} morning -> ${clock(s.arrival)} ${s.late ? 'LATE' : 'on time'}`);
    };
    window.setTimeout(tick, 120);
  }, [route, cand, say]);

  /* The 1,000-morning loop, animated by batches so it reads as accumulation. */
  const runAll = useCallback(() => {
    setLog([
      `$ commute plan --leave ${clock(cand.leave)} --by 09:00`,
      `  method   monte carlo · ${N} draws per route · seed fixed`,
      `  live     511 GTFS-Realtime · Google Routes · HealthKit · WeatherKit`,
      `  routes   nl (bus)   bart (fallback)`
    ]);
    const finish = () => {
      runs.forEach(r => say(
        `  ${r.route.k.padEnd(5)} p50 ${clock(r.p50)}  p90 ${clock(r.p90)}  on time ${Math.round(r.onTime * 100)}%`
      ));
      say(`  rule     the alarm must survive the fallback -> test bart`);
      say(allowed
        ? `  ALLOWED  ride ${ride.route.k}, hold ${ride === fallback ? 'nl' : 'bart'}, alarm ${clock(cand.leave - ROUTINE)}`
        : `  REJECTED leave earlier`);
    };
    if (reduced.current){ setDrawn(N); finish(); return; }
    setDrawn(0);
    let n = 0;
    const step = () => {
      n = Math.min(N, n + 24);
      setDrawn(n);
      if (n < N) requestAnimationFrame(step);
      else finish();
    };
    requestAnimationFrame(step);
  }, [cand, runs, allowed, ride, fallback, say]);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node = hostRef.current;
    if (!node) return;
    if (reduced.current){ setArmed(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting){ setArmed(true); io.disconnect(); }
    }, {threshold: .15});
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    sampleOne(7); // a fixed first morning, so the opening read is the same for everyone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, lane]);

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(runAll, reduced.current ? 0 : 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, pick]);

  const eqParts = one ? one.parts : route.legs.map(l => (l.lo + l.hi) / 2);

  return <div ref={hostRef} className={`mlab${armed ? ' isArmed' : ''}`}>
    <header className="mlabHead">
      <h2>How Commute chooses the alarm each morning.</h2>
      <p>A Monte Carlo loop, run on both routes: play the morning out 1,000 times each, keep the departures that still reach 9:00 in at least 90% of them, and take the latest one. It runs below, in your browser, on the ranges I measured over 10 weeks.</p>
    </header>

    {/* ── 1. one morning ─────────────────────────────────────────── */}
    <section className="mlabStep">
      <div className="mlabStepHead">
        <b>1</b>
        <div>
          <strong>Play one morning</strong>
          <span>Every term is a range I measured, not a fixed number. One pass of the loop draws a value from each and checks the arrival against 9:00.</span>
        </div>
        <div className="mlabPicker" role="group" aria-label="Route to sample">
          {ROUTES.map((r, i) => <button key={r.k} type="button" aria-pressed={i === lane} onClick={() => setLane(i)}>{r.name}</button>)}
        </div>
      </div>

      <div className="mlabEq" role="img" aria-label={one
        ? `Leaving at ${clock(cand.leave)} by ${route.name}: ${route.legs.map((l, i) => `${l.name} ${one.parts[i].toFixed(1)} minutes`).join(', ')}${one.delay ? `, plus ${one.delay.toFixed(0)} minutes lost` : ''}, arriving ${clock(one.arrival)}`
        : 'The arrival equation'}>
        <div className="mlabTerm is-seed">
          <em>leave</em>
          <b>{clock(cand.leave)}</b>
          <i aria-hidden="true"/>
          <small>candidate<cite>alarm + learned routine</cite></small>
        </div>
        {route.legs.map((l, i) => {
          const v = eqParts[i];
          const at = ((v - l.lo) / (l.hi - l.lo)) * 100;
          const lit = revealed > i;
          return <React.Fragment key={l.k}>
            <span className="mlabOp" aria-hidden="true">+</span>
            <div className={`mlabTerm${lit ? ' isLit' : ''}`}>
              <em>{l.name}</em>
              <b>{lit ? v.toFixed(1) : l.short}<u>{lit ? 'min' : ''}</u></b>
              <i aria-hidden="true"><s style={{'--at': `${Math.max(0, Math.min(100, at))}%`} as React.CSSProperties}/></i>
              <small>{l.lo}–{l.hi}<cite>{l.src}</cite></small>
            </div>
          </React.Fragment>;
        })}
        {one && one.delay > 0 && revealed > route.legs.length && <>
          <span className="mlabOp" aria-hidden="true">+</span>
          <div className="mlabTerm is-delay isLit">
            <em>{route.disrupt.label}</em>
            <b>{one.delay.toFixed(0)}<u>min</u></b>
            <i aria-hidden="true"/>
            <small>{Math.round(route.disrupt.p * 10)} mornings in 10<cite>{route.disrupt.src}</cite></small>
          </div>
        </>}
        <span className="mlabOp is-eq" aria-hidden="true">=</span>
        <div className={`mlabTerm is-out${one && revealed > route.legs.length ? ' isLit' : ''}${one && one.late ? ' is-late' : ''}`}>
          <em>walk in at</em>
          <b>{one && revealed > route.legs.length ? clock(one.arrival) : '—'}</b>
          <i aria-hidden="true"/>
          <small>{one && revealed > route.legs.length ? (one.late ? 'missed 9:00' : 'made it') : 'deadline 9:00'}</small>
        </div>
        <button type="button" className="mlabGhostBtn mlabDrawBtn" onClick={() => sampleOne()}>Draw another ↻</button>
      </div>
    </section>

    {/* ── 2. the loop, on both routes ────────────────────────────── */}
    <section className="mlabStep">
      <div className="mlabStepHead">
        <b>2</b>
        <div>
          <strong>Run the loop 1,000 times — on both routes</strong>
          <span>One bar per minute of arrival. The bus is quicker on a good morning; the train is the one that always has another train five minutes behind it. Since the bus can fall through, the 90% test is applied to the train I would fall back to.</span>
        </div>
        <div className="mlabPicker" role="group" aria-label="Candidate departure time">
          {CANDIDATES.map((c, i) => <button key={c.leave} type="button" aria-pressed={i === pick} onClick={() => setPick(i)}>
            leave {clock(c.leave)}
          </button>)}
        </div>
      </div>

      <p className="mlabRunCount" aria-live="polite">
        <b>{Math.min(drawn, N).toLocaleString()}</b> / 1,000 mornings simulated per route
        {done && <button type="button" className="mlabGhostBtn" onClick={runAll}>Run again ↻</button>}
      </p>

      <div className="mlabRoutes">
        {ROUTES.map((r, i) => <RouteRun
          key={r.k} route={r} leave={cand.leave} seed={cand.seed} drawn={drawn} binding={i === 1}
        />)}
      </div>

      <pre className="mlabTerminal" aria-live="polite" aria-label="Simulation log">
        {log.map((l, i) => <code key={i}>{l}</code>)}
      </pre>
    </section>

    {/* ── 3. one answer ──────────────────────────────────────────── */}
    <section className="mlabStep mlabStepLast">
      <div className="mlabStepHead">
        <b>3</b>
        <div>
          <strong>Take the latest departure the fallback survives, then subtract the routine</strong>
          <span>The model never shows a reader a probability. All of the above exists to produce one number, once a day.</span>
        </div>
      </div>

      <div className="mlabAnswer">
        {CANDIDATES.map(c => {
          const bart = runSim(ROUTES[1], c.leave, c.seed);
          const nl = runSim(ROUTES[0], c.leave, c.seed);
          const ok = bart.onTime >= TARGET;
          const latest = ok && !CANDIDATES.some(o => o.leave > c.leave && runSim(ROUTES[1], o.leave, o.seed).onTime >= TARGET);
          return <div key={c.leave} className={`mlabOption${ok ? '' : ' is-out'}${latest ? ' is-pick' : ''}`}>
            <b>{clock(c.leave)}</b>
            <span>bus {Math.round(nl.onTime * 100)}% · train {Math.round(bart.onTime * 100)}%</span>
            <em>{latest ? 'latest departure the fallback survives' : ok ? 'safe, but earlier than it needs to be' : 'the fallback misses 9:00 too often'}</em>
          </div>;
        })}
      </div>

      <p className="mlabMath">
        <span>{clock(CANDIDATES[1].leave)} <small>chosen departure</small></span>
        <i aria-hidden="true">−</i>
        <span>{ROUTINE} min <small>learned routine</small></span>
        <i aria-hidden="true">=</i>
        <strong>{clock(CANDIDATES[1].leave - ROUTINE)} <small>alarm</small></strong>
      </p>

      <p className="mlabHandoff">
        The plan wakes me for the bus and holds the train behind it. Which one I actually take is decided later, by a live check before I leave — the next section.
      </p>
    </section>
  </div>;
}
