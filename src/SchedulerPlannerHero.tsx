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
        <svg className="schInkDate" viewBox="0 0 46 42" aria-hidden="true">
          <path d="M15.2 10.6c-2.9 2.4-5 3.7-7.6 4.4" style={{'--len': 9, '--o': '0ms', '--t': '.22s'} as React.CSSProperties}/>
          <path d="M14.4 10.2 13.6 34.8" style={{'--len': 25, '--o': '170ms', '--t': '.3s'} as React.CSSProperties}/>
          <path d="M38.2 11.4c-6 1.5-10.3 7-11 13.7-.5 4.9 1.7 8.9 5.6 9.3 3.5.4 6.2-2 6.4-5.1.2-3.3-2.2-5.6-5.4-5.5-2.5.1-4.8 1.6-6 3.8" style={{'--len': 60, '--o': '470ms', '--t': '.62s'} as React.CSSProperties}/>
        </svg>
        SEP
      </time>
      <div><strong>Design Sync</strong><p>Tuesday · 10:30–11:00</p><small>Minskoff Pavilion · 3 people</small></div><b>✓</b></article>
    <div className="schPencil" aria-hidden="true"/>
    <small className="schHeroCaption">From uncertain plans to one calendar-ready event.</small>
  </div>
}
