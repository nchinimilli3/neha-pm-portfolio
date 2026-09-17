import React, { useEffect, useRef, useState } from 'react';
import './scheduler-visuals.css';

function useLive<T extends Element>(threshold = .35) {
 const ref = useRef<T>(null);
 const [inView, setInView] = useState(false);
 useEffect(() => {
  const el = ref.current; if (!el) return;
  const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {threshold});
  io.observe(el); return () => io.disconnect();
 }, [threshold]);
 return [ref, inView] as const;
}

const meant = [['yes', 'maybe', 'no', 'yes'], ['maybe', 'yes', 'yes', 'no'], ['no', 'maybe', 'yes', 'maybe']];
const icons: Record<string, React.ReactNode> = {
 yes: <path d="M5 10.5l3.2 3.2L15 6.8"/>,
 maybe: <path d="M7.3 7.4a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.9v.6M10 15.2v.3"/>,
 no: <path d="M6.5 6.5l7 7M13.5 6.5l-7 7"/>,
};

// The problem: students answer with Available, Maybe, and No, but a heatmap only keeps "free or not",
// and even the overlap leaves the group with questions the grid can't answer.
export function SchedulerFlatten() {
 const [ref, inView] = useLive<HTMLDivElement>();
 const [kept, setKept] = useState(false);
 useEffect(() => {
  if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const id = window.setInterval(() => setKept(k => !k), 3200);
  return () => window.clearInterval(id);
 }, [inView]);
 return <div ref={ref} className={`scFlat ${kept ? 'isKept' : ''}`}>
  <div className="scFlatToggle" role="group" aria-label="Compare what students meant with what a heatmap keeps">
   <button type="button" aria-pressed={!kept} onClick={() => setKept(false)}>What students meant</button>
   <button type="button" aria-pressed={kept} onClick={() => setKept(true)}>What a heatmap keeps</button>
  </div>
  <div className="scFlatGrid" role="img" aria-label={kept ? 'Only free or not free remains; every Maybe is gone' : 'Available, Maybe, and No answers across four days'}>
   <span/>{['Tue', 'Wed', 'Thu', 'Fri'].map(d => <b key={d}>{d}</b>)}
   {['10:00', '10:30', '11:00'].map((t, r) => <React.Fragment key={t}><small>{t}</small>{meant[r].map((v, c) => <i key={c} className={`scCell s-${v}`} style={{'--d': `${(r * 4 + c) * 40}ms`} as React.CSSProperties}><svg viewBox="0 0 20 20" aria-hidden="true">{icons[v]}</svg></i>)}</React.Fragment>)}
  </div>
  <div className="scFlatLegend" aria-hidden="true"><span className="s-yes"><i/>Available</span><span className="s-maybe"><i/>Maybe</span><span className="s-no"><i/>No</span></div>
  <ul className="scFlatQuestions" aria-label="Questions left after finding overlap">
   {['Which slot do we pick?', 'Where do we meet?', 'Who sends the invite?'].map((q, i) => <li key={q} style={{'--q': i} as React.CSSProperties}>{q}</li>)}
  </ul>
 </div>;
}

// Build: one event record, kept in sync across every participant's device.
export function SchedulerSync() {
 const [ref, inView] = useLive<HTMLDivElement>(.25);
 const svgRef = useRef<SVGSVGElement>(null);
 useEffect(() => { const s = svgRef.current; if (!s) return; inView ? s.unpauseAnimations() : s.pauseAnimations(); }, [inView]);
 const toLaptop = 'M300 150C260 150 250 150 222 150';
 const toPhoneA = 'M480 128C520 110 540 98 572 92';
 const toPhoneB = 'M480 172C540 196 600 214 650 222';
 return <div ref={ref} className="scSync">
  <svg ref={svgRef} viewBox="0 0 780 380" role="img" aria-label="One Design Sync event record syncs to a laptop and two phones over Socket.IO, with Flask applying event rules and MySQL storing the record">
   <defs>
    <linearGradient id="scScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbfaf6"/><stop offset="1" stopColor="#eef2ec"/></linearGradient>
    <linearGradient id="scMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8dcd9"/><stop offset="1" stopColor="#9aa29d"/></linearGradient>
    <radialGradient id="scGround"><stop offset="0" stopColor="#1f2b27" stopOpacity=".22"/><stop offset="1" stopColor="#1f2b27" stopOpacity="0"/></radialGradient>
   </defs>
   {[toLaptop, toPhoneA, toPhoneB].map((d, i) => <g key={i}><path d={d} className="scWire"/><circle r="4.5" className="scPulse"><animateMotion dur="2.2s" begin={`${i * .5}s`} repeatCount="indefinite" path={d}/></circle></g>)}
   <text x="390" y="88" className="scWireLabel" textAnchor="middle">Socket.IO · real time</text>

   {/* laptop */}
   <ellipse cx="130" cy="236" rx="118" ry="8" fill="url(#scGround)"/>
   <rect x="36" y="82" width="186" height="124" rx="9" fill="#1f2622"/>
   <rect x="44" y="90" width="170" height="108" rx="3" fill="url(#scScreen)"/>
   <rect x="44" y="90" width="170" height="14" fill="#285b4c"/>
   {Array.from({length: 12}, (_, k) => { const c = k % 4, r = Math.floor(k / 4); const cls = k === 5 ? 'scMiniBest' : [0, 3, 6, 9, 10].includes(k) ? 'scMiniYes' : [1, 8, 11].includes(k) ? 'scMiniMaybe' : 'scMiniEmpty'; return <rect key={k} x={56 + c * 38} y={114 + r * 26} width="32" height="20" rx="3" className={cls}/>; })}
   <path d="M18 206h222l-14 14H32z" fill="url(#scMetal)"/><rect x="108" y="206" width="42" height="4" rx="2" fill="#7f8783"/>

   {/* event record */}
   <g className="scRecord">
    <rect x="300" y="104" width="180" height="96" rx="14" fill="#fff" stroke="#285b4c33"/>
    <rect x="300" y="104" width="7" height="96" rx="3.5" fill="#285b4c"/>
    <text x="322" y="132" className="scRecTitle">Design Sync</text>
    <text x="322" y="152" className="scRecLine">Tue · 10:30–11:00</text>
    <text x="322" y="170" className="scRecLine">Minskoff Pavilion</text>
    {['#8f5b45', '#d9a17f', '#72503f'].map((c, i) => <circle key={c} cx={330 + i * 14} cy="186" r="7" fill={c} stroke="#fff" strokeWidth="2"/>)}
    <text x="378" y="190" className="scRecLine">3 going</text>
   </g>

   {/* phones */}
   {[[572, 26, -6], [650, 156, 5]].map(([x, y, rot], i) => <g key={i} transform={`rotate(${rot} ${x + 42} ${y + 80})`}>
    <rect x={x} y={y} width="84" height="164" rx="16" fill="#1f2622"/>
    <rect x={x + 5} y={y + 6} width="74" height="152" rx="12" fill="url(#scScreen)"/>
    <rect x={x + 30} y={y + 10} width="24" height="6" rx="3" fill="#1f2622"/>
    <rect x={x + 12} y={y + 30} width="60" height="44" rx="8" fill="#fff" stroke="#285b4c30"/>
    <rect x={x + 12} y={y + 30} width="4" height="44" rx="2" fill="#285b4c"/>
    <path d={`M${x + 22} ${y + 44}h38M${x + 22} ${y + 54}h28M${x + 22} ${y + 64}h32`} className="scPhoneLines"/>
    <rect x={x + 12} y={y + 84} width="60" height="18" rx="9" fill="#285b4c"/>
    <text x={x + 42} y={y + 96.5} className="scPhoneBtn">{i === 0 ? 'Going' : 'Added'}</text>
   </g>)}

   {/* backend */}
   <path d="M390 200V268M390 268H330M390 268H452" className="scWireBack"/>
   <g transform="translate(300 262)"><path d="M10 0h12v14l12 22a4 4 0 0 1-3.5 6h-29A4 4 0 0 1-2 36l12-22z" className="scIconFill"/><path d="M8 0h16" className="scIconStroke"/><path d="M3 30h26" className="scIconStroke" opacity=".5"/></g>
   <text x="316" y="324" className="scBackLabel">Flask</text><text x="316" y="340" className="scBackSub">event rules</text>
   <g transform="translate(446 262)"><ellipse cx="16" cy="6" rx="16" ry="6" className="scIconFill"/><path d="M0 6v28c0 3.3 7.2 6 16 6s16-2.7 16-6V6" className="scIconFill"/><path d="M0 16c0 3.3 7.2 6 16 6s16-2.7 16-6M0 26c0 3.3 7.2 6 16 6s16-2.7 16-6" className="scIconStroke" opacity=".45"/></g>
   <text x="462" y="324" className="scBackLabel">MySQL</text><text x="462" y="340" className="scBackSub">stored record</text>
   <text x="770" y="370" className="scBackSub scDeploy">Deployed with Docker on Google Cloud Run</text>
  </svg>
 </div>;
}

// Live demo: paint your availability, flip to the group heatmap, and watch the best time update.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIMES = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
type Mark = '' | 'yes' | 'maybe' | 'no';
const MODES: [Exclude<Mark, ''>, string][] = [['yes', 'Available'], ['maybe', 'Maybe'], ['no', 'Unavailable']];
// Maya and Alex's answers per slot, row by row.
const OTHERS = [[1, 0, 1, 1, 0], [1, 1, 1, 0, 1], [0, 1, 1, 2, 1], [1, 2, 1, 1, 0], [0, 2, 1, 0, 1], [1, 1, 0, 1, 0], [0, 0, 1, 0, 1]].flat();
const OTHER_NO = [[1, 1, 0, 0, 2], [0, 0, 1, 1, 0], [1, 0, 0, 0, 0], [0, 0, 1, 0, 1], [2, 0, 0, 1, 0], [0, 0, 1, 0, 1], [1, 2, 0, 1, 0]].flat();
const seedMarks = (): Mark[] => { const m: Mark[] = Array(35).fill(''); m[0] = 'yes'; m[7] = 'yes'; m[13] = 'no'; m[16] = 'yes'; m[21] = 'maybe'; m[24] = 'maybe'; return m; };

export function SchedulerDemo() {
 const [marks, setMarks] = useState<Mark[]>(seedMarks);
 const [notes, setNotes] = useState<Record<number, string>>({13: 'Class until 10:30'});
 const [mode, setMode] = useState<Exclude<Mark, ''>>('yes');
 const [heat, setHeat] = useState(false);
 const [venues, setVenues] = useState([{name: 'Minskoff Pavilion', votes: 1}, {name: 'MSU Library', votes: 1}]);
 const [myVenue, setMyVenue] = useState('Minskoff Pavilion');
 const [newVenue, setNewVenue] = useState('');
 const [chat, setChat] = useState([{who: 'Maya', text: 'Tuesday morning works for me.'}, {who: 'Alex', text: 'Adding mine tonight. Library is closer for me.'}]);
 const [draft, setDraft] = useState('');
 const [toast, setToast] = useState('');
 const drag = useRef<Mark | null>(null);
 const timer = useRef<number>(undefined);
 const chatRef = useRef<HTMLDivElement>(null);
 const flash = (m: string) => { setToast(m); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(''), 1600); };
 useEffect(() => () => window.clearTimeout(timer.current), []);
 useEffect(() => { const c = chatRef.current; if (c) c.scrollTop = c.scrollHeight; }, [chat]);

 const yes = (i: number) => OTHERS[i] + (marks[i] === 'yes' ? 1 : 0);
 const no = (i: number) => OTHER_NO[i] + (marks[i] === 'no' ? 1 : 0);
 let best = 0;
 for (let i = 1; i < 35; i++) if (yes(i) > yes(best) || (yes(i) === yes(best) && no(i) < no(best))) best = i;
 const bestDay = DAYS[best % 5], bestRow = Math.floor(best / 5);
 const bestEnd = TIMES[bestRow + 1] ?? '12:30';
 const tally = venues.map(v => ({...v, total: v.votes + (myVenue === v.name ? 1 : 0)}));
 const totalVotes = tally.reduce((a, v) => a + v.total, 0);
 const leader = tally.reduce((a, v) => v.total > a.total ? v : a, tally[0]);

 const paint = (i: number) => { const v = drag.current; if (v === null) return; setMarks(m => m[i] === v ? m : m.map((x, j) => j === i ? v : x)); };
 useEffect(() => {
  const move = (e: PointerEvent) => { if (drag.current === null) return; const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-slot]'); if (el) paint(Number(el.dataset.slot)); };
  const up = () => { drag.current = null; };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
 }, []);
 const down = (i: number, e: React.PointerEvent) => {
  if (heat || (e.pointerType === 'mouse' && e.button !== 0)) return;
  e.preventDefault(); drag.current = marks[i] === mode ? '' : mode; paint(i);
 };
 const fills: [string, (i: number) => boolean, string][] = [
  ['All free', () => true, 'Marked every slot available'],
  ['9–10:30', i => i < 20, 'Marked 9:00–10:30 available'],
  ['11–12', i => i >= 20, 'Marked 11:00–12:00 available'],
  ['Clear', () => false, 'Cleared your availability'],
 ];
 const fill = ([, pick, msg]: typeof fills[number]) => { setHeat(false); setMarks(Array.from({length: 35}, (_, i) => pick(i) ? 'yes' : '')); flash(msg); };
 const link = `${location.origin}${location.pathname}#/projects/scheduler`;
 const when = `${bestDay} ${TIMES[bestRow]}–${bestEnd}`;
 const shares: [string, string, string][] = [
  ['Link', link, 'Invite link copied'],
  ['Discord', `**Design Sync** · ${when} at ${leader.name}\nAdd your availability: ${link}`, 'Discord message copied'],
  ['Email', `Subject: Design Sync, ${when}\n\nHi all, add your availability here: ${link}\nCurrent pick: ${when} at ${leader.name}.`, 'Email draft copied'],
 ];
 const copy = async ([, text, msg]: typeof shares[number]) => { try { await navigator.clipboard.writeText(text); flash(msg); } catch { flash('Clipboard unavailable'); } };
 const exportIcs = () => {
  const [h, m] = TIMES[bestRow].split(':').map(Number), date = 15 + (best % 5), stamp = (mins: number) => `202609${date}T${String(Math.floor(mins / 60)).padStart(2, '0')}${String(mins % 60).padStart(2, '0')}00`;
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Neha Portfolio//Scheduler Demo//EN', 'BEGIN:VEVENT', 'SUMMARY:Design Sync', `LOCATION:${leader.name}`, `DTSTART:${stamp(h * 60 + m)}`, `DTEND:${stamp(h * 60 + m + 30)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], {type: 'text/calendar'})); const a = document.createElement('a'); a.href = url; a.download = 'design-sync.ics'; a.click(); URL.revokeObjectURL(url); flash('Calendar file downloaded');
 };
 const addVenue = () => { const v = newVenue.trim(); if (!v || venues.some(x => x.name.toLowerCase() === v.toLowerCase())) return; setVenues(x => [...x, {name: v, votes: 0}]); setMyVenue(v); setNewVenue(''); flash(`Added ${v}`); };
 const send = () => { const t = draft.trim(); if (!t) return; setChat(c => [...c, {who: 'You', text: t}]); setDraft(''); };

 return <div className={`sx ${heat ? 'isHeat' : ''}`}>
  <div className="sxHead">
   <div><span className="sxEyebrow">Group project · Sep 15–19</span><h3>Design Sync</h3><p key={leader.name}>{when} · {leader.name}</p></div>
   <div className="sxShare"><span>Share</span>{shares.map(sh => <button key={sh[0]} type="button" onClick={() => copy(sh)}>{sh[0]}</button>)}</div>
  </div>

  <div className="sxMain">
   <div className="sxPlan">
    <div className="sxBar">
     <div className="sxSeg" role="group" aria-label="View">
      <button type="button" aria-pressed={!heat} onClick={() => setHeat(false)}>My availability</button>
      <button type="button" aria-pressed={heat} onClick={() => setHeat(true)}>Group heatmap</button>
     </div>
     {heat
      ? <div className="sxScale" aria-hidden="true"><span>0</span>{[0, 1, 2, 3].map(n => <i key={n} className={`sxH${n}`}/>)}<span>3 free</span></div>
      : <div className="sxModes" role="group" aria-label="Paint as">{MODES.map(([k, label]) => <button key={k} type="button" className={`m-${k}`} aria-pressed={mode === k} onClick={() => setMode(k)}><i/>{label}</button>)}</div>}
    </div>

    <div className="sxBest" aria-live="polite">
     <span className="sxBestIcon" aria-hidden="true"><svg viewBox="0 0 20 20">{icons.yes}</svg></span>
     <div><strong key={best}>{bestDay} · {TIMES[bestRow]}–{bestEnd}</strong><p>Best time · {yes(best)} of 3 available{no(best) ? ` · ${no(best)} conflict${no(best) > 1 ? 's' : ''}` : ' · no conflicts'}</p></div>
     <button type="button" className="sxPrimary" onClick={exportIcs}>Add to calendar</button>
    </div>

    <div className="sxGrid" role="grid" aria-label={heat ? 'Group availability heatmap' : 'Your availability; click or drag to paint'}>
     <span/>{DAYS.map(d => <b key={d} className={d === bestDay ? 'isBestCol' : ''}>{d}</b>)}
     {TIMES.map((t, r) => <React.Fragment key={t}>
      <small>{t}</small>
      {DAYS.map((d, c) => { const i = r * 5 + c, mk = marks[i];
       return <button key={d} type="button" data-slot={i}
        className={`sxCell ${heat ? `sxH${yes(i)}` : `m-${mk || 'empty'}`} ${i === best ? 'isBest' : ''} ${notes[i] ? 'sxNote' : ''}`}
        aria-label={`${d} ${t}: ${heat ? `${yes(i)} of 3 available` : mk ? MODES.find(x => x[0] === mk)![1] : 'not set'}${notes[i] ? `, note: ${notes[i]}` : ''}`}
        title={notes[i] || undefined}
        onPointerDown={e => down(i, e)}
        onContextMenu={e => { e.preventDefault(); setNotes(n => { const x = {...n}; if (x[i]) delete x[i]; else x[i] = 'Class / hold'; return x; }); flash(notes[i] ? 'Note removed' : 'Note added'); }}
        onKeyDown={e => { if (!heat && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setMarks(m => m.map((x, j) => j === i ? (x === mode ? '' : mode) : x)); } }}>
        {heat ? <span className="sxCount">{yes(i)}</span> : mk && <svg viewBox="0 0 20 20" aria-hidden="true">{icons[mk]}</svg>}
       </button>; })}
     </React.Fragment>)}
    </div>

    <div className="sxFoot">
     <span className="sxQuick">Quick fill{fills.map(f => <button key={f[0]} type="button" onClick={() => fill(f)}>{f[0]}</button>)}</span>
     <span>{heat ? 'Darker means more people are free' : 'Drag to paint · right-click for a note'}</span>
    </div>
   </div>

   <div className="sxSide">
    <div className="sxBlock">
     <div className="sxLabel">People <span>2 of 3 responded</span></div>
     <div className="sxPeopleList">
      {[['N', 'You', true], ['M', 'Maya', true], ['A', 'Alex', false]].map(([i, n, ok]) => <div key={n as string}><i>{i}</i>{n}<span className={ok ? 'isIn' : ''}>{ok ? 'Responded' : 'Pending'}</span></div>)}
     </div>
    </div>
    <div className="sxBlock">
     <div className="sxLabel">Where <span>{totalVotes} votes</span></div>
     <div className="sxPoll" role="radiogroup" aria-label="Vote for a venue">
      {tally.map(v => <button key={v.name} type="button" role="radio" aria-checked={myVenue === v.name} onClick={() => setMyVenue(v.name)} style={{'--p': `${totalVotes ? v.total / totalVotes * 100 : 0}%`} as React.CSSProperties}>
       <span>{v.name}</span><b>{v.total}</b>
      </button>)}
     </div>
     <form className="sxInline" onSubmit={e => { e.preventDefault(); addVenue(); }}><input value={newVenue} onChange={e => setNewVenue(e.target.value)} placeholder="Suggest a place" aria-label="Suggest a place"/><button type="submit">Add</button></form>
    </div>
    <div className="sxBlock sxChatSec">
     <div className="sxLabel">Event chat</div>
     <div className="sxChat" ref={chatRef}>{chat.map((m, k) => <p key={k} className={m.who === 'You' ? 'isMine' : ''}>{m.who !== 'You' && <b>{m.who}</b>}{m.text}</p>)}</div>
     <form className="sxInline" onSubmit={e => { e.preventDefault(); send(); }}><input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Message the group" aria-label="Message the group"/><button type="submit">Send</button></form>
    </div>
   </div>
  </div>
  <div className={`sxToast ${toast ? 'isOn' : ''}`} role="status">{toast}</div>
 </div>;
}
