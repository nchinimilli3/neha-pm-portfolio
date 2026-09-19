import React, { useEffect, useRef, useState } from 'react';
import './accenture-visuals.css';

const icon = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;

// The request relays down through the real tools, one hand-off at a time; a #021 token rides the line.
export function AccentureToolRelay() {
 const tools = [
  {slug: 'salesforce', color: '#00A1E0', name: 'Salesforce', did: 'Holds the request record and its intake fields'},
  {slug: 'googlesheets', color: '#34A853', name: 'Google Sheets', did: 'Tracks repeated patterns and process issues'},
  {slug: 'openai', color: '#111111', name: 'Codex prototype', did: 'Runs the rules and flags review cases'},
  {slug: 'googleslides', color: '#F4B400', name: 'Google Slides', did: 'Turns findings into recommended next steps'},
 ];
 return <div className="axRelay" aria-label="The request moved from Salesforce to Google Sheets, a Codex prototype, and Google Slides">
  <span className="axRelayToken" aria-hidden="true">#021</span>
  <ol>{tools.map(tool => <li key={tool.slug}>
   <span className="axLogo" style={{'--logo': `url(${icon(tool.slug)})`, '--brand': tool.color} as React.CSSProperties} role="img" aria-label={`${tool.name} logo`}/>
   <strong>{tool.name}</strong>
   <p>{tool.did}</p>
  </li>)}</ol>
 </div>;
}

// Synthesis as an SF cable car ride: a Powell-line car climbs out of the fog (raw responses), past
// row houses and street signs where the evidence narrows, to 90-Day Test Hill. Loops while in view.
const rideStops = [
 {n: '3,862', street: 'Responses St', caption: '3,862 user responses and operational data, revealing an 8x utilization gap.'},
 {n: '27', street: 'Metrics Ave', caption: 'The signal is captured as 27 metrics.'},
 {n: '12', street: 'Patterns St', caption: 'Metrics are synthesized into 12 recurring patterns.'},
 {n: '5', street: 'Recommendations Way', caption: 'Patterns are prioritized into 5 recommendations.'},
 {n: '90-day', street: 'Test Hill', caption: 'Each recommendation becomes a hypothesis with a 90-day test.'},
];
const TRACK = {x0: 70, y0: 420, x1: 930, y1: 150};
const SLOPE = (TRACK.y1 - TRACK.y0) / (TRACK.x1 - TRACK.x0);
const ANGLE = Math.atan(SLOPE) * 180 / Math.PI;
const yAt = (x: number) => TRACK.y0 + (x - TRACK.x0) * SLOPE;
const stopX = [150, 335, 515, 695, 870];
const houseColors = [['#e9c3d3', '#b9678c'], ['#cdd9ec', '#5d7fae'], ['#f2dfb1', '#b58a3c'], ['#d3e5d2', '#5f8a67'], ['#ddcbf0', '#7d59a8']];

function CableCar() {
 return <g className="axCarArt" filter="url(#axCarShadow)">
  <path d="M-3 12V-20" className="axGrip"/>
  {[-60, -44, 44, 60].map(x => <g key={x}><circle cx={x} cy="-5" r="6.5" className="axWheel"/><circle cx={x} cy="-5" r="2" className="axHub"/></g>)}
  <rect x="-80" y="-16" width="160" height="6" rx="2" className="axCarFrame"/>
  <rect x="-76" y="-20" width="152" height="5" rx="2" className="axCarStep"/>
  {/* enclosed ends */}
  {[-1, 1].map(side => <g key={side} transform={`scale(${side} 1)`}>
   <rect x="22" y="-100" width="52" height="82" className="axCarCream"/>
   <rect x="22" y="-52" width="52" height="34" className="axCarMaroon"/>
   <rect x="26" y="-48" width="44" height="26" rx="2" className="axCarGold"/>
   {[28, 44, 58].map(x => <path key={x} d={`M${x} -64V-86a6 6 0 0 1 12 0V-64z`} className="axCarWindow"/>)}
   {[28, 44, 58].map(x => <path key={'g' + x} d={`M${x + 2.5} -84l4 -3v18l-4 3z`} className="axCarGlare"/>)}
   <rect x="20" y="-57" width="56" height="4" className="axCarTrim"/>
   <circle cx="77" cy="-40" r="3.5" className="axCarLamp"/>
  </g>)}
  {/* open grip section with brass poles and riders */}
  <rect x="-22" y="-26" width="44" height="8" className="axCarMaroon"/>
  <path d="M-19 -26V-100M19 -26V-100" className="axCarPole"/>
  <g className="axRiders">
   <circle cx="-8" cy="-74" r="5.5" className="axRiderHead"/><path d="M-15 -26v-30a7 7 0 0 1 14 0v30z" className="axRiderA"/>
   <circle cx="9" cy="-71" r="5" className="axRiderHead2"/><path d="M3 -26v-27a6 6 0 0 1 12 0v27z" className="axRiderB"/>
  </g>
  <path d="M0 -26V-48" className="axGripLever"/>
  {/* roof and clerestory */}
  <path d="M-84 -100h168l-4 -8h-160z" className="axCarRoof"/>
  <rect x="-62" y="-118" width="124" height="10" rx="2" className="axCarCream"/>
  {[-50, -30, -10, 10, 30].map(x => <rect key={x} x={x} y="-116" width="14" height="6" rx="1" className="axCarWindow"/>)}
  <path d="M-66 -118h132l-3 -5h-126z" className="axCarRoof"/>
  <circle cx="0" cy="-37" r="7.5" className="axCarBadge"/><text x="0" y="-34" className="axCarNum">21</text>
 </g>;
}

export function AccentureEvidenceFunnel() {
 const ref = useRef<HTMLDivElement>(null);
 const [inView, setInView] = useState(false);
 const [tick, setTick] = useState(0);
 const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 useEffect(() => {
  const el = ref.current; if (!el) return;
  const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {threshold: .3});
  io.observe(el); return () => io.disconnect();
 }, []);
 useEffect(() => {
  if (reduced) { setTick(4); return; }
  if (!inView) return;
  // Five stops, two held beats at the top, then back down into the fog.
  const id = window.setInterval(() => setTick(t => (t + 1) % 7), 2200);
  return () => window.clearInterval(id);
 }, [inView, reduced]);
 const stop = Math.min(tick, 4);
 const carX = stopX[stop] + 62;
 const houses = Array.from({length: 13}, (_, i) => {
  const x = -10 + i * 80; const h = 92 + ((i * 37) % 34);
  return {x, w: 72, h, base: yAt(x + 72) - 16, c: houseColors[i % houseColors.length]};
 });
 const road = (dy: number) => `M-20 ${yAt(-20) + dy}L1020 ${yAt(1020) + dy}`;
 return <div ref={ref} className={`axRide stop-${stop} ${tick === 0 ? 'isBoarding' : ''}`}>
  <svg viewBox="0 -30 1000 520" role="img" aria-label="A cable car climbs from 3,862 user responses in the fog, past 27 metrics, 12 patterns, and 5 recommendations, to a 90-day test for each">
   <defs>
    <linearGradient id="axHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bda3dc" stopOpacity=".5"/><stop offset="1" stopColor="#bda3dc" stopOpacity="0"/></linearGradient>
    <linearGradient id="axFogGrad" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset=".6" stopColor="#fff" stopOpacity=".75"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
    <filter id="axFogBlur" x="-60%" y="-150%" width="220%" height="400%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="axCarShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#241536" floodOpacity=".25"/></filter>
    <linearGradient id="axEdgeGrad" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".07" stopColor="#fff"/><stop offset=".93" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
    <mask id="axEdgeFade" maskUnits="userSpaceOnUse" x="-40" y="-60" width="1080" height="580"><rect x="-20" y="-60" width="1040" height="580" fill="url(#axEdgeGrad)"/></mask>
    <linearGradient id="axGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5b6b80"/><stop offset="1" stopColor="#2c3443"/></linearGradient>
   </defs>
   <g mask="url(#axEdgeFade)">
   {/* row houses stepping up the hill */}
   <g className="axHouses" aria-hidden="true">{houses.map((hs, i) => {
    const top = hs.base - hs.h;
    return <g key={i} style={{'--hi': i} as React.CSSProperties}>
     <rect x={hs.x} y={top} width={hs.w} height={hs.h + 40} fill={hs.c[0]}/>
     <path d={`M${hs.x - 4} ${top}L${hs.x + hs.w / 2} ${top - 24}L${hs.x + hs.w + 4} ${top}z`} fill={hs.c[1]}/>
     <rect x={hs.x - 3} y={top} width={hs.w + 6} height="5" fill={hs.c[1]}/>
     <path d={`M${hs.x + 8} ${top + 22}h26v34h-26z`} className="axBay"/>
     <path d={`M${hs.x + 44} ${top + 22}h18v22h-18zM${hs.x + 44} ${top + 52}h18v22h-18z`} className="axHouseWin"/>
     <path d={`M${hs.x + 12} ${top + 64}h18v${Math.max(hs.h - 64, 10)}h-18z`} className="axDoor" fill={hs.c[1]}/>
    </g>;
   })}</g>
   <path className="axHill" d={`M-20 490V${yAt(-20) + 22}L1020 ${yAt(1020) + 22}V490z`}/>
   <path className="axSidewalk" d={`M-20 ${yAt(-20) - 16}L1020 ${yAt(1020) - 16}L1020 ${yAt(1020) - 10}L-20 ${yAt(-20) - 10}z`}/>
   <path className="axRoad" d={`M-20 ${yAt(-20) - 10}L1020 ${yAt(1020) - 10}L1020 ${yAt(1020) + 22}L-20 ${yAt(-20) + 22}z`}/>
   <path className="axRailLine" d={road(1)}/><path className="axRailLine" d={road(12)}/>
   <path className="axCable" d={road(7)}/>
   </g>
   {rideStops.map((st, i) => {
    const px = stopX[i]; const base = yAt(px) - 16;
    return <g key={st.street} className={`axSign ${stop >= i ? 'isPassed' : ''} ${stop === i ? 'isHere' : ''}`}>
     <path className="axPole" d={`M${px} ${base}V${base - 150}`}/>
     <g className="axBlade" transform={`translate(${px} ${base - 170})`}>
      <rect x="-82" y="-27" width="164" height="54" rx="6" className="axBladeFace"/>
      <rect x="-78" y="-23" width="156" height="46" rx="4" className="axBladeInset"/>
      <text y="-3" className="axSignNum">{st.n}</text>
      <text y="15" className="axSignStreet">{st.street}</text>
     </g>
    </g>;
   })}
   <g className="axCar" style={{transform: `translate(${carX}px, ${yAt(carX) + 2}px) rotate(${ANGLE}deg)`}} aria-hidden="true"><CableCar/></g>
   <g className="axFog" filter="url(#axFogBlur)" aria-hidden="true">
    <ellipse cx="120" cy="420" rx="300" ry="70" className="axFogBank f1"/>
    <ellipse cx="260" cy="360" rx="260" ry="50" className="axFogBank f2"/>
    <ellipse cx="60" cy="300" rx="220" ry="44" className="axFogBank f3"/>
    <ellipse cx="420" cy="440" rx="240" ry="40" className="axFogBank f4"/>
   </g>
  </svg>
  <p className="axRideNow" aria-live="polite"><b>{stop + 1}</b>{rideStops[stop].caption}</p>
  <ol className="axRideStops">{rideStops.map((st, i) => <li key={st.street} className={stop >= i ? 'isPassed' : ''}><strong>{st.n}</strong><span>{st.street}</span></li>)}</ol>
 </div>;
}

// Automated checks ride the track until the gate; anything uncertain lifts the barrier to a person.
export function AccentureBoundary() {
 const stops = [
  {kind: 'auto', title: 'Structure the intake', copy: 'Required fields and matching criteria'},
  {kind: 'auto', title: 'Validate the match', copy: 'Expertise, capacity, availability, time zone'},
  {kind: 'gate', title: 'Is context or information missing?', copy: 'Warnings and conflicts stop here'},
  {kind: 'human', title: 'Resolve and approve', copy: 'Local context and final judgment'},
 ];
 return <div className="axBoundary">
  <ol className="axTrack">{stops.map(stop => <li key={stop.title} className={`is-${stop.kind}`}>
   <span className="axStop" aria-hidden="true">
    {stop.kind === 'auto' && <svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3.5"/></svg>}
    {stop.kind === 'gate' && <svg viewBox="0 0 48 36"><path d="M8 34V10M4 34h8"/><path className="axArm" d="M8 12l38-9"/><path className="axStripes" d="M15 10.4l3-.7M23 8.5l3-.7M31 6.6l3-.7M39 4.7l3-.7"/><circle cx="8" cy="12" r="3"/></svg>}
    {stop.kind === 'human' && <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.6 3.7-7 7.5-7s6.7 2.4 7.5 7"/></svg>}
   </span>
   <strong>{stop.title}</strong>
   <p>{stop.copy}</p>
  </li>)}</ol>
  <div className="axProof">
   <svg className="axClock" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" className="axClockFace"/>{Array.from({length:12},(_,i)=><path key={i} d="M60 12v8" transform={`rotate(${i*30} 60 60)`} className="axClockTick"/>)}<path d="M60 60L48 38" className="axClockHour"/><path d="M60 60v38" className="axClockMin"/><circle cx="60" cy="60" r="4" className="axClockPin"/><path d="M92 24a14 14 0 1 0 14 18a11 11 0 0 1-14-18z" className="axClockMoon"/></svg>
   <div className="axEdge">
    <p className="axEdgeWhen"><strong>10:30 PM</strong> in the trainer’s local time</p>
    <p className="axEdgeBefore"><span>Expertise ✓</span><span>Availability ✓</span><s>Valid match</s></p>
    <p className="axEdgeAfter"><i aria-hidden="true">→</i>Added working-hours and time-zone checks. A free calendar slot is not enough.</p>
   </div>
  </div>
 </div>;
}

// Groups of related items appear one after another the first time they scroll into view.
const staggerGroups = ['.requestScreens', '.axRelay ol', '.axTrack', '.axBoundary', '.caseHeader .metricStrip'];
export function AccentureStagger() {
 useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const groups = staggerGroups.flatMap(sel => [...document.querySelectorAll<HTMLElement>(`.case-accenture ${sel}`)]);
  groups.forEach(g => { g.classList.add('axStagger'); [...g.children].forEach((c, i) => (c as HTMLElement).style.setProperty('--si', String(i))); });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
   if (e.isIntersecting) { e.target.classList.add('isIn'); io.unobserve(e.target); }
  }), {threshold: .2});
  groups.forEach(g => io.observe(g));
  return () => io.disconnect();
 }, []);
 return null;
}
