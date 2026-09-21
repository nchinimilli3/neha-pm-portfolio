import React, { useEffect, useState } from 'react';
import './commute-surfaces.css';

/* One morning model, rendered on every surface the app ships to: the Lock
   Screen Live Activity, the Dynamic Island, the Home Screen widget, and the
   app itself. The case study holds one instance, so the demo phone and the
   surfaces section always show the same minute of the same morning. */

const WAKE = 438;   // 7:18
const LEAVE = 486;  // 8:06
const BOARD = 494;  // 8:14
const ARRIVE = 533; // 8:53
const DEADLINE = 540;
export const MORNING_START = 425;
export const MORNING_END = 545;

export type Delay = 0 | 2 | 6;
type Phase = 'asleep' | 'ready' | 'walking' | 'train' | 'arrived';
type GlyphKind = 'alarm' | 'walk' | 'train' | 'check';

export const clock = (m: number) => {
 const h = Math.floor(m / 60), mm = m % 60;
 return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')}`;
};

export function useMorning() {
 const [t, setT] = useState(452);
 const [delay, setDelay] = useState<Delay>(0);
 const [playing, setPlaying] = useState(false);

 useEffect(() => {
  if (!playing) return;
  const id = window.setInterval(() => setT(v => {
   if (v >= MORNING_END) { setPlaying(false); return v; }
   return v + 1;
  }), 95);
  return () => window.clearInterval(id);
 }, [playing]);

 // Only a delay that breaks the plan moves anything: take the earlier train.
 const changed = delay === 2;
 const route = changed ? 'BART' : 'NL bus';
 const leaveShift = changed ? 6 : 0;
 const wake = WAKE, leave = LEAVE - leaveShift, board = BOARD - leaveShift;
 const phase: Phase = t < wake ? 'asleep' : t < leave ? 'ready' : t < board ? 'walking' : t < ARRIVE ? 'train' : 'arrived';
 const pct = (a: number, b: number) => Math.max(0, Math.min(100, ((t - a) / (b - a)) * 100));

 const live: { icon: GlyphKind; title: string; sub: string; big: string; progress: number } | null =
  phase === 'ready' ? { icon: 'walk', title: `Leave in ${leave - t} min`, sub: `${route} · Oakland → San Francisco`, big: clock(leave), progress: pct(wake, leave) }
  : phase === 'walking' ? { icon: 'walk', title: `Train in ${board - t} min`, sub: '10 min walk to 19th St', big: clock(board), progress: pct(leave, board) }
  : phase === 'train' ? { icon: 'train', title: 'On BART', sub: `Arrive ${clock(ARRIVE)} · ${DEADLINE - ARRIVE} min early`, big: clock(ARRIVE), progress: pct(board, ARRIVE) }
  : null;

 const island: { icon: GlyphKind; text: string; title: string; sub: string } =
  phase === 'asleep' ? { icon: 'alarm', text: clock(wake), title: 'Alarm set', sub: `Wake ${clock(wake)} · leave ${clock(leave)}` }
  : phase === 'arrived' ? { icon: 'check', text: 'Arrived', title: 'You made it', sub: `Arrived ${clock(ARRIVE)} · ${DEADLINE - ARRIVE} min early` }
  : { icon: live!.icon, text: phase === 'train' ? clock(ARRIVE) : `${(phase === 'ready' ? leave : board) - t}m`, title: live!.title, sub: live!.sub };

 const notice = changed && (phase === 'asleep' || phase === 'ready')
  ? phase === 'asleep'
   ? { title: `Switch to BART`, body: 'The live NL check changed after the alarm. Your wake time stays the same.' }
   : { title: `Leave at ${clock(leave)} for BART`, body: 'The NL bus is five minutes late and its arrival range now crosses 9:00.' }
  : null;

 const status = changed ? 'Switch to BART' : 'NL on time';

 return { t, setT, delay, setDelay, playing, setPlaying, changed, route, wake, leave, board, phase, live, island, notice, status, arrive: ARRIVE, deadline: DEADLINE };
}
export type Morning = ReturnType<typeof useMorning>;

export const Glyph = ({ kind }: { kind: GlyphKind }) => {
 if (kind === 'alarm') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.4 1.6M5 4.5 2.8 6.7M19 4.5l2.2 2.2"/></svg>;
 if (kind === 'walk') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4.5" r="1.8"/><path d="M11 21l2-6.5-2.6-2.4 1-4.6 3.6 3 3 .8M10.4 8 7 10.2 6 14M13 14.5l2.5 6.5"/></svg>;
 if (kind === 'train') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 20l-2 2M15 20l2 2"/><circle cx="9" cy="14" r=".9"/><circle cx="15" cy="14" r=".9"/></svg>;
 return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>;
};

/* The Lock Screen, in the same hardware frame as the app demo. Tapping the
   Live Activity or the notification opens the app. */
function LockScreen({ m, onOpen }: { m: Morning; onOpen: () => void }) {
 return <div className={`csLock phase-${m.phase}`}>
  <p className="csDate">Tuesday, September 15</p>
  <p className="csClock">{clock(m.t)}</p>

  {m.notice && <button type="button" className="csNotice" key={m.notice.title} onClick={onOpen}>
   <span className="csAppIcon" aria-hidden="true"/>
   <span className="csNoticeText"><b>Commute <em>now</em></b><strong>{m.notice.title}</strong><span>{m.notice.body}</span></span>
  </button>}

  <div className="csLockFoot">
   {m.phase === 'asleep' && <div className="csAlarmPill"><Glyph kind="alarm"/><span><b>{clock(m.wake)}</b> alarm · planned around a 9:00 arrival</span></div>}

   {m.live && <button type="button" className="csLive" onClick={onOpen} aria-label={`${m.live.title}. Open Commute`}>
    <span className="csLiveTop">
     <span className="csLiveIcon"><Glyph kind={m.live.icon}/></span>
     <span className="csLiveCopy"><strong>{m.live.title}</strong><span>{m.live.sub}</span></span>
     <b className="csLiveBig">{m.live.big}</b>
    </span>
    <span className="csLiveBar"><i style={{ width: `${m.live.progress}%` }}/><em style={{ left: `${m.live.progress}%` }}/></span>
    {m.delay === 2 && <span className="csLiveNote">BART +2 · plan holds, nothing to do</span>}
   </button>}

   {m.phase === 'arrived' && <div className="csLive csLiveDone">
    <span className="csLiveTop">
     <span className="csLiveIcon"><Glyph kind="check"/></span>
     <span className="csLiveCopy"><strong>Arrived {clock(m.arrive)}</strong><span>{m.deadline - m.arrive} min before 9:00 · app never opened</span></span>
    </span>
   </div>}

   <p className="csSwipe">Tap the Live Activity to open Commute</p>
  </div>
 </div>;
}

export function MorningControls({ m, compact = false }: { m: Morning; compact?: boolean }) {
 return <div className={`csControls${compact ? ' isCompact' : ''}`}>
  <button type="button" className="csPlay" onClick={() => { if (m.t >= MORNING_END) m.setT(MORNING_START); m.setPlaying(p => !p); }} aria-pressed={m.playing}>
   {m.playing ? '❚❚' : '▶'}<span>{m.playing ? 'Pause' : 'Play the morning'}</span>
  </button>
  <label className="csScrub">
   <span>{clock(m.t)}</span>
   <input type="range" min={MORNING_START} max={MORNING_END} value={m.t} onChange={e => { m.setPlaying(false); m.setT(+e.target.value); }} aria-label="Time of morning"/>
  </label>
  <div className="csDelay" role="group" aria-label="Choose the live NL bus update and see which route Commute selects">
   {([0, 2] as Delay[]).map(d => <button type="button" key={d} aria-pressed={m.delay === d} onClick={() => {m.setPlaying(false);m.setT(Math.max(m.t,470));m.setDelay(d)}}>{d === 0 ? 'NL on time → take NL' : 'NL 5 min late → take BART'}</button>)}
  </div>
 </div>;
}

/* The demo phone: starts on the Lock Screen, because that is where the app
   actually lives. The full app is one tap away. */
export function CommutePhoneDemo({ m, app }: { m: Morning; app: React.ReactNode }) {
 const [view, setView] = useState<'lock' | 'app'>('lock');
 return <div className="csDemo">
  <div className="csViewSwitch" role="tablist" aria-label="Demo view">
   <button type="button" role="tab" aria-selected={view === 'lock'} onClick={() => setView('lock')}>Lock Screen</button>
   <button type="button" role="tab" aria-selected={view === 'app'} onClick={() => setView('app')}>App</button>
  </div>

  {view === 'lock'
   ? <div className="iphoneDemoStage">
     <div className="iosPhoneDevice csDevice">
      <div className="iosDemoShell csLockShell"><LockScreen m={m} onOpen={() => setView('app')}/></div>
      <img className="iosHardwareFrame" src="project-media/iphone-frame-v31.png" alt="" aria-hidden="true"/>
      <div className={`csIsland${m.phase !== 'asleep' ? ' isLive' : ''}`} aria-hidden="true">
       <span className="csIslandIcon"><Glyph kind={m.island.icon}/></span>
       <span className="csIslandText">{m.island.text}</span>
      </div>
     </div>
    </div>
   : <div className="iphoneDemoStage">{app}</div>}

  {view === 'lock' ? <MorningControls m={m} compact/> : <p className="cmDemoHint">Tap through the real app. <button type="button" className="csBack" onClick={() => setView('lock')}>Back to the Lock Screen</button></p>}
 </div>;
}

/* The surfaces the morning ships to, beyond the Lock Screen. */
export function CommuteSurfaces({ m }: { m: Morning }) {
 const nlRange = m.delay === 0 ? '8:42 to 8:54' : '8:47 to 9:02';
 return <div className="csSurfaces">
  <div className={`csSurfaceNotice${m.notice?' isVisible':''}`} role="status" aria-live="polite">
   <span className="csAppIcon" aria-hidden="true"/>
   <span className="csDecisionBody">
    <b>Commute <em>live route check</em></b>
    <strong>{m.changed ? 'Take BART instead' : 'Take the NL bus'}</strong>
    <small>{m.changed ? `NL now arrives ${nlRange}. Leave at ${clock(m.leave)} for BART and still arrive by 8:53.` : 'Live traffic confirms the NL bus is faster today and still arrives before 9:00.'}</small>
   </span>
  </div>
  <div className="csSurfaceRow">
   <figure className="csSurface">
    <div className="csIslandWide">
     <span className="csIslandIcon"><Glyph kind={m.island.icon}/></span>
     <span className="csIslandWideCopy"><b>{m.island.title}</b><span>{m.island.sub}</span></span>
     <b className="csIslandWideBig">{m.live ? m.live.big : m.phase === 'asleep' ? clock(m.wake) : '✓'}</b>
    </div>
    <figcaption>Dynamic Island · one number, always the next one</figcaption>
   </figure>

   <figure className="csSurface">
    <div className="csWidget">
     <header><span className="csAppIcon" aria-hidden="true"/><b>Commute</b><em className={m.changed ? 'isChanged' : ''}>{m.status}</em></header>
     <dl>
      <div><dt>Wake</dt><dd>{clock(m.wake)}</dd></div>
      <div><dt>Leave</dt><dd>{clock(m.leave)}</dd></div>
      <div><dt>Take</dt><dd>{m.route}</dd></div>
     </dl>
     <p>Arrive {clock(m.arrive)} · Salesforce Tower</p>
    </div>
    <figcaption>Home Screen widget · the whole plan at a glance</figcaption>
   </figure>
  </div>

  <MorningControls m={m}/>

  <ol className="csRules">
   <li className={!m.changed ? 'isOn' : ''}><b>NL is on time</b><span>The bus is faster today, so Commute keeps NL and the phone stays quiet.</span></li>
   <li className={m.changed ? 'isOn' : ''}><b>NL is five minutes late</b><span>The arrival range now crosses 9:00, so Commute switches the live plan to BART.</span></li>
   <li className={m.phase !== 'asleep' ? 'isOn' : ''}><b>The message explains the decision</b><span>It combines the live transit update with the learned routine estimate and gives the next action.</span></li>
  </ol>
 </div>;
}
