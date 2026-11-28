import React, { useEffect, useRef, useState } from 'react';
import './scheduler-v2.css';

/* Object north star: Papier Weekly Happenings planner: https://www.papier.com/us/weekly-happenings-454 */
/* UI north star: Google Calendar official week view: https://storage.googleapis.com/support-kms-prod/qcBMpABlDvO6QwWeDsPZBBbiZe5ZSwEuYKaI */

/* The planner fills itself in the order a group would: answers land one by one, the best
   time is ringed once they are all in, and only then does the event get written. Blank is
   an answer too. Nobody marks unavailability, they just leave the square alone. */
const WEEK: [string, string[]][] = [
  ['10',    ['A', '?', '', 'A', '']],
  ['10:30', ['?', 'A*', 'A', '?', '']],
  ['11',    ['', 'A', '?', '', 'A']],
];

const TILT = [-2.6, 1.9, -1.1, 2.3, -.7, 1.5, -2.1, .9, 1.8, -1.4];

// The "16": path, length (its dash), and when it starts after the pencil lands.
const INK: [string, number, string][] = [
  ['M15.2 10.6c-2.9 2.4-5 3.7-7.6 4.4', 9, '0ms'],
  ['M14.4 10.2 13.6 34.8', 25, '170ms'],
  ['M38.2 11.4c-6 1.5-10.3 7-11 13.7-.5 4.9 1.7 8.9 5.6 9.3 3.5.4 6.2-2 6.4-5.1.2-3.3-2.2-5.6-5.4-5.5-2.5.1-4.8 1.6-6 3.8', 60, '470ms'],
];
const INK_LOOP = 9000;   // ms; matches schInkFade and schPencilLoop
export default function SchedulerPlannerHero(){
  // The sequence is the point, so it plays when the planner is actually on screen and again
  // whenever it comes back, instead of once at mount where a visitor can easily miss it.
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), {threshold: .3});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Aim the pencil at the drawn date. Its travel used to be fixed pixel offsets, which
  // missed the "16" whenever the planner rendered at a different size. Measure where the
  // tip lands at the writing angle and hand the offset to the keyframes as --tx / --ty.
  const pencil = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLElement>(null);
  const date = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const aim = () => {
      const p = pencil.current, t = tip.current, d = date.current;
      if (!p || !t || !d) return;
      const {animation, transform} = p.style;
      p.style.animation = 'none';
      p.style.transform = 'none';
      const scale = p.getBoundingClientRect().width / (p.offsetWidth || 1);
      p.style.transform = 'rotate(34deg)';
      const tr = t.getBoundingClientRect(), dr = d.getBoundingClientRect();
      p.style.setProperty('--tx', `${(dr.left + dr.width * .5 - tr.left) / scale}px`);
      p.style.setProperty('--ty', `${(dr.top + dr.height * .55 - tr.top) / scale}px`);
      p.style.transform = transform;
      p.style.animation = animation;
    };
    aim();
    const late = window.setTimeout(aim, 2400);   // after the ticket has settled into place
    window.addEventListener('resize', aim);
    return () => { window.clearTimeout(late); window.removeEventListener('resize', aim); };
  }, []);
  // Each stroke fades on the GPU, but its draw (stroke-dashoffset) can't, so the draw is a short
  // one-shot that each fade loop re-arms while the stroke is faded out: no main-thread work between draws.
  useEffect(() => {
    const d = date.current;
    if (!d) return;
    const rearm = (e: AnimationEvent) => {
      if (e.animationName !== 'schInkFade') return;
      const fade = (e.target as Element).getAnimations()[0];
      const draw = (e.target as Element).firstElementChild?.getAnimations()[0];
      const i = fade?.effect?.getComputedTiming().currentIteration;
      if (fade?.startTime == null || !draw || i == null) return;
      draw.startTime = Number(fade.startTime) + INK_LOOP * i;
    };
    d.addEventListener('animationiteration', rearm);
    return () => d.removeEventListener('animationiteration', rearm);
  }, []);
  let step = 0;
  return <div ref={ref} className={`schPlannerHero ${live ? 'isLive' : ''}`} role="img" aria-label="A tactile weekly desk planner that turns tentative availability into a confirmed calendar event">
    <div className="schPlannerCover"><span>WEEKLY</span><b>HAPPENINGS</b></div>
    <div className="schPlannerPad">
      <header><div><span>SEPTEMBER</span><strong>15–19</strong></div><em>Group project week</em></header>
      <div className="schPlannerGrid">
        <span/>{['MON','TUE','WED','THU','FRI'].map(d => <b key={d}>{d}</b>)}
        {WEEK.map(([time, cells]) => <React.Fragment key={time}>
          <span>{time}</span>
          {cells.map((cell, c) => {
            if (!cell) return <i key={c}/>;
            const selected = cell === 'A*';
            const n = step++;
            const style = {'--d': `${n * 95}ms`, '--r': `${TILT[n % TILT.length]}deg`} as React.CSSProperties;
            return <i key={c} className={selected ? 'selected' : cell === '?' ? 'maybe' : ''} style={style}>{selected ? 'A' : cell}</i>;
          })}
        </React.Fragment>)}
      </div>
      <footer><span><i>A</i> Available</span><span><i>?</i> Maybe</span><em>Blank means booked</em></footer>
    </div>
    <article className="schEventTicket"><span>RECOMMENDED</span>
      <time>
        {/* The date is drawn rather than typed: each stroke is dashed out and pulled back in
            while the pencil is over it, so the card reads as written by hand. */}
        <span ref={date} className="schInkDate" aria-hidden="true">
          {INK.map(([d, len, o]) => <svg key={d} viewBox="0 0 46 42" style={{'--len': len, '--o': o} as React.CSSProperties}><path d={d}/></svg>)}
        </span>
        SEP
      </time>
      <div><strong>Design Sync</strong><p>Tuesday · 10:30–11:00</p><small>Minskoff Pavilion · 3 people</small></div><b>✓</b></article>
    <div ref={pencil} className="schPencil" aria-hidden="true"><i ref={tip} className="schPencilTip"/></div>
    <small className="schHeroCaption">From uncertain plans to one calendar-ready event.</small>
  </div>
}
