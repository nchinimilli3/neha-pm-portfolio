import React, {useEffect, useRef, useState} from 'react';

/* The request relay, played twice. First by hand: the visitor is the
   coordinator and hits the same two traps the real process had, a required
   field that arrives empty and a time that only looks fine in the requester's
   zone. Then the same request runs through the automation, which applies
   the rules and stops only where a person has to decide. The comparison counts
   the visitor's own clicks, so no number here is invented. People and times
   are illustrative.

   Each screen is drawn after the real product: Salesforce Lightning's record
   page, Slack's channel view with Block Kit messages, and Google Calendar's
   "Find a time" grid with a guest's working hours. */

type Trainer = {id: string; name: string; city: string; initial: string; certified: boolean; load: number; note?: string; code?: string};
const trainers: Trainer[] = [
  {id: 'marcus', name: 'Marcus T.', city: 'London', initial: 'M', certified: true, load: 3, note: 'Marcus is already teaching 3 of 3 sessions this week.', code: 'At capacity'},
  {id: 'priya', name: 'Priya S.', city: 'Berlin', initial: 'P', certified: true, load: 1},
  {id: 'ana', name: 'Ana R.', city: 'Madrid', initial: 'A', certified: false, load: 0, note: 'Ana isn’t certified to teach Enterprise AI basics yet.', code: 'Not certified'}
];

/* Berlin runs six hours ahead of New York. Priya works 9 AM to 5 PM.
   Grid rows are 9 AM, 11 AM and 1 PM in New York, so 3, 5 and 7 PM in Berlin. */
type Slot = {id: string; day: string; et: string; local: string; ok: boolean; why?: string; col: number; row: number};
const slots: Slot[] = [
  {id: 'tue1', day: 'Tue 22', et: '1:00 PM', local: '7:00 PM', ok: false, why: 'That’s 7:00 PM in Berlin, after Priya’s working day.', col: 1, row: 3},
  {id: 'tue9', day: 'Tue 22', et: '9:00 AM', local: '3:00 PM', ok: true, col: 1, row: 1},
  {id: 'wed11', day: 'Wed 23', et: '11:00 AM', local: '5:00 PM', ok: false, why: 'That starts at 5:00 PM in Berlin, when Priya’s day ends.', col: 2, row: 2}
];
const good = slots.find(s => s.ok)!;
const hours = {et: ['9 AM', '11 AM', '1 PM'], local: ['3 PM', '5 PM', '7 PM']};

type Mode = 'manual' | 'auto';

const Icon = {
  search: <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  cloud: <svg viewBox="0 0 40 28" aria-hidden="true"><path d="M16.6 3.1a7 7 0 0 1 11.1 1.6 8.6 8.6 0 0 1 3.4-.7c4.8 0 8.6 3.9 8.6 8.7s-3.9 8.7-8.6 8.7l-1.7-.2a6.3 6.3 0 0 1-8.3 2.6 7.2 7.2 0 0 1-13.4-.4 6.6 6.6 0 0 1-1.4.1C2.6 23.5 0 20.8 0 17.3c0-2.3 1.2-4.3 3-5.4a7.6 7.6 0 0 1 13.6-8.8Z" fill="#00a1e0"/></svg>,
  waffle: <svg viewBox="0 0 12 12" aria-hidden="true">{[1, 6, 11].flatMap(y => [1, 6, 11].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="currentColor"/>))}</svg>,
  record: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="10" height="12" rx="1.5" fill="none" stroke="#fff" strokeWidth="1.5"/><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  warn: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 15 14H1Z" fill="#fe9339"/><path d="M8 6v3.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/><circle cx="8" cy="11.6" r=".9" fill="#fff"/></svg>,
  check: <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#fff"/><path d="m4.8 8.2 2.1 2.1 4.3-4.5" fill="none" stroke="#2e844a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  home: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H9.5v-3.5h-3v3.5H3a.5.5 0 0 1-.5-.5Z" fill="currentColor"/></svg>,
  dm: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.5h11v7.5H7l-3 2.5v-2.5H2.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  bell: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 11V7.5a4 4 0 0 1 8 0V11l1.2 1.3H2.8ZM6.5 13.5a1.6 1.6 0 0 0 3 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  send: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m2 13.5 12-5.5L2 2.5l1.6 5.5Z" fill="currentColor"/></svg>,
  bolt: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.2 1.5 3.5 9h4l-1 5.5L12.5 7h-4Z" fill="#fff"/></svg>,
  star: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m8 2 1.8 3.8 4.1.5-3 2.9.8 4.1L8 11.3l-3.7 2 .8-4.1-3-2.9 4.1-.5Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  plus: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  help: <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M6.3 6.4a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="11.3" r=".8" fill="currentColor"/></svg>,
  eye: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>
};

export default function AccentureRequestRelay() {
  const [mode, setMode] = useState<Mode>('manual');
  const [stage, setStage] = useState(0);            // 0 Salesforce, 1 Slack, 2 Calendar, 3 booked
  const [asked, setAsked] = useState(false);
  const [region, setRegion] = useState(false);
  const [typing, setTyping] = useState(false);
  const [shortlist, setShortlist] = useState(false);
  const [trainer, setTrainer] = useState<string | null>(null);
  const [nudge, setNudge] = useState<string | null>(null);
  const [zone, setZone] = useState<'et' | 'local'>('et');
  const [checked, setChecked] = useState(0);        // slots the automation has checked so far
  const [slot, setSlot] = useState<string | null>(null);
  const [miss, setMiss] = useState<string | null>(null);
  const [tally, setTally] = useState({clicks: 0, dead: 0});
  const [byHand, setByHand] = useState<{clicks: number; dead: number} | null>(null);
  const feed = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);
  useEffect(() => { const id = requestAnimationFrame(() => { const el = feed.current; if (el) el.scrollTo({top: el.scrollHeight, behavior: 'smooth'}); }); return () => cancelAnimationFrame(id); }, [stage, asked, typing, region, shortlist, nudge, trainer]);

  const click = (dead = false) => setTally(t => ({clicks: t.clicks + 1, dead: t.dead + (dead ? 1 : 0)}));
  const auto = mode === 'auto';

  const start = (next: Mode) => {
    clearTimers();
    setMode(next); setStage(0); setAsked(false); setRegion(false); setTyping(false); setShortlist(false);
    setTrainer(null); setNudge(null); setZone('et'); setChecked(0); setSlot(null); setMiss(null); setTally({clicks: 0, dead: 0});
    if (next === 'auto') later(() => setStage(1), 700);   // the request routes itself
  };

  /* By hand */
  const submit = () => { click(); setStage(1); };
  const ask = () => {
    click(); setAsked(true);
    later(() => setTyping(true), 500);
    later(() => { setTyping(false); setRegion(true); setShortlist(true); }, 1700);
  };
  const pick = (t: Trainer) => {
    if (!t.certified || t.load >= 3) { click(true); setNudge(t.note ?? null); return; }
    click(); setNudge(null); setTrainer(t.id);
    later(() => setStage(2), 700);
  };
  const book = (s: Slot) => {
    if (!s.ok) { click(true); setMiss(s.why ?? null); setZone('local'); return; }
    click(); setMiss(null); setSlot(s.id); setStage(3);
    setByHand({clicks: tally.clicks + 1, dead: tally.dead});
  };

  /* Automated: the rules run on their own; the visitor only clears the review stops. */
  const confirmRegion = () => {
    click(); setRegion(true);
    later(() => setShortlist(true), 500);
    later(() => setTrainer('priya'), 1300);
    later(() => { setStage(2); setZone('local'); }, 2000);
    slots.forEach((_, i) => later(() => setChecked(i + 1), 2500 + i * 450));
  };
  const approve = () => { click(); setSlot(good.id); setStage(3); };
  const flipZone = (z: 'et' | 'local') => { if (!auto && z !== zone) click(); setZone(z); };

  const active = Math.min(stage, 2);
  const chosen = trainers.find(t => t.id === trainer);
  const booked = slots.find(s => s.id === slot);
  const step = (i: number) => `requestStep${active === i ? ' isActive' : ''}${stage > i ? ' isDone' : ''}${stage < i ? ' isLocked' : ''}`;
  const path = ['New', auto ? 'Routed' : 'Submitted', 'Matched', 'Scheduled'];
  const status = path[stage];

  const slotState = (s: Slot, i: number) => {
    if (auto) return i < checked ? (s.ok ? ' isPass' : ' isOff') : ' isChecking';
    return miss && zone === 'local' && !s.ok ? ' isOff' : '';
  };

  return (
    <div className={`requestWalkthrough rqLive${auto ? ' isAuto' : ''}`}>
      <div className="rqModeBar">
        <p className="requestStepHint">{auto
          ? <><b>After the automation.</b> Same request, same rules, now run for you. You only clear what it stops for review.</>
          : <><b>Before the automation.</b> You’re the coordinator: take request #021 from intake to a booked trainer by hand.</>}</p>
        <div className="rqModes" role="group" aria-label="Which version of the workflow">
          <button type="button" aria-pressed={!auto} onClick={() => start('manual')}>By hand</button>
          <button type="button" aria-pressed={auto} onClick={() => start('auto')}>Automated</button>
        </div>
      </div>

      <div className="requestScreens isStepped" key={mode}>
        {/* ---------- Salesforce Lightning ---------- */}
        <article className={step(0)}>
          <header><b>{stage > 0 ? '✓' : '1'}</b><div><h3>{auto ? 'The request is checked the moment it lands in Salesforce.' : 'Requests started in Salesforce with the basic session details.'}</h3></div></header>
          <div className="requestApp sfApp">
            <div className="sfGlobal">
              <span className="sfLogo">{Icon.cloud}</span>
              <span className="sfSearch">{Icon.search}Search…</span>
              <span className="sfTools" aria-hidden="true">{Icon.star}{Icon.plus}{Icon.help}{Icon.bell}</span>
              <b className="sfAvatar" aria-hidden="true">Y</b>
            </div>
            <div className="sfNav">
              <span className="sfWaffle">{Icon.waffle}</span>
              <strong>Service</strong>
              <span>Home</span>
              <span className="isOn">Requests</span>
            </div>
            <div className="sfPage">
              <div className="sfCard sfHead">
                <span className="sfObj">{Icon.record}</span>
                <div><small>Training Request</small><strong>Enterprise AI basics</strong></div>
                {!auto && stage === 0
                  ? <button type="button" className="sfBtn isBrand" onClick={submit}>Submit</button>
                  : <span className="sfBtn" aria-hidden="true">+ Follow</span>}
              </div>
              <ol className="sfPath" aria-label={`Status: ${status}`}>
                {path.map((p, i) => <li key={p} className={i < stage ? 'isDone' : i === stage ? 'isNow' : ''}>{i < stage ? '✓' : p}</li>)}
              </ol>
              <div className="sfCard sfDetails">
                <div className="sfTabs"><span className="isOn">Details</span><span>Related</span></div>
                <dl className="sfFields">
                  <div><dt>Request Number</dt><dd>REQ-00021</dd></div>
                  <div><dt>Status</dt><dd>{status}</dd></div>
                  <div><dt>Request Owner</dt><dd className="sfLink">Customer team</dd></div>
                  <div><dt>Timing</dt><dd>Next week</dd></div>
                  <div className={auto && !region && stage > 0 ? 'isMissing' : ''}>
                    <dt>Region{auto && <abbr title="required">*</abbr>}</dt>
                    <dd>{region ? <span className="rqFilled">EMEA</span> : auto && stage > 0 ? <>{Icon.warn}<span>—</span></> : '—'}</dd>
                    {auto && !region && stage > 0 && <p className="sfError">Complete this field.</p>}
                  </div>
                  <div><dt>Language</dt><dd>{region ? <span className="rqFilled">English</span> : '—'}</dd></div>
                </dl>
              </div>
              {auto && stage === 0 && <p className="sfToast isInfo"><i className="sfSpin"/>Checking required fields…</p>}
              {stage > 0 && <p className="sfToast isTimed">{Icon.check}<span>{auto ? 'Routed to #enablement-ops with 1 field flagged.' : 'Request REQ-00021 was submitted.'}</span><i aria-hidden="true">×</i></p>}
            </div>
          </div>
        </article>

        {/* ---------- Slack ---------- */}
        <article className={step(1)}>
          <header><b>{stage > 1 ? '✓' : '2'}</b><div><h3>{auto ? 'Matching rules shortlist trainers, each with a reason.' : 'A coordinator filled the gaps and reviewed which trainers fit.'}</h3></div></header>
          <div className="requestApp skApp">
            <div className="skTop"><span className="skArrows" aria-hidden="true">←&nbsp;&nbsp;→</span><span className="skSearch">{Icon.search}Search Enablement</span></div>
            <div className="skBody">
              <div className="skRail" aria-hidden="true">
                <b className="skWs">E</b>
                <span className="isOn">{Icon.home}<small>Home</small></span>
                <span>{Icon.dm}<small>DMs</small></span>
                <span>{Icon.bell}<small>Activity</small></span>
              </div>
              <div className="skPane">
                <div className="skHead"><strong># enablement-ops <small>⌄</small></strong><span className="skPile" aria-hidden="true"><i/><i/><i/><em>12</em></span></div>
                <div className="skTabs" aria-hidden="true"><span className="isOn">Messages</span><span>Files</span><span>+</span></div>
                <div className="skFeed" ref={feed}>
                  {stage > 0 && <p className="skDate"><span>Today ⌄</span></p>}
                  {stage === 0 ? <p className="skEmpty">This is the very beginning of <b>#enablement-ops</b>.</p> : <>
                    <div className="skMsg rqIn">
                      <b className="skAv isBot">{Icon.bolt}</b>
                      <div>
                        <p className="skName">Request bot <small>APP</small> <time>10:42 AM</time></p>
                        <p>New training request <b>REQ-00021</b></p>
                        <div className="skFields">
                          <div><b>Course</b><span>Enterprise AI basics</span></div>
                          <div><b>Timing</b><span>Next week</span></div>
                          <div><b>Region</b><span className={region ? 'rqFilled' : 'skWarn'}>{region ? 'EMEA · English' : '⚠️ Not provided'}</span></div>
                        </div>
                        {(auto ? region : asked) && <span className="skReact rqIn">{auto ? '✅' : '👀'} <b>1</b></span>}
                        {auto && !region && <>
                          <p className="skContext">🛑 Review stop: region is required to match a trainer.</p>
                          <div className="skActions"><button type="button" className="skBtn isPrimary" onClick={confirmRegion}>Confirm EMEA · English</button><span className="skBtn" aria-hidden="true">Edit</span></div>
                        </>}
                        {!auto && !asked && <div className="skActions"><button type="button" className="skBtn isPrimary" onClick={ask}>Ask requester for region</button><span className="skBtn" aria-hidden="true">View in Salesforce</span></div>}
                      </div>
                    </div>

                    {auto ? <>
                      {region && <div className="skMsg rqIn"><b className="skAv isYou">Y</b><div><p className="skName">You <time>10:43 AM</time></p><p>Confirmed region: EMEA, English.</p></div></div>}
                      {shortlist && <div className="skMsg rqIn">
                        <b className="skAv isBot">{Icon.bolt}</b>
                        <div>
                          <p className="skName">Request bot <small>APP</small> <time>10:43 AM</time></p>
                          <p>Checked 3 trainers for expertise, certification, and capacity.</p>
                          <div className="skList">
                            {trainers.map((t, i) => (
                              <div key={t.id} className={`skRow rqIn${trainer === t.id ? ' isPicked' : ''}${t.code ? ' isOut' : ''}`} style={{animationDelay: `${i * 120}ms`}}>
                                <div><p><b>{t.name}</b> · {t.city}</p><p className="skContext">{t.code ? `⛔ ${t.code}` : '✅ Match'}</p></div>
                              </div>
                            ))}
                          </div>
                          {chosen && <p className="skContext rqIn">Matched {chosen.name} Checking Berlin working hours…</p>}
                        </div>
                      </div>}
                    </> : <>
                      {asked && <div className="skMsg rqIn"><b className="skAv isYou">Y</b><div><p className="skName">You <time>10:44 AM</time></p><p><span className="skMention">@customer-team</span> which region and language is this for?</p></div></div>}
                      {region && <div className="skMsg rqIn"><b className="skAv isCust">C</b><div><p className="skName">Customer team <time>10:51 AM</time></p><p>EMEA, delivered in English.</p></div></div>}
                      {shortlist && <div className="skMsg rqIn">
                        <b className="skAv isBot">{Icon.bolt}</b>
                        <div>
                          <p className="skName">Request bot <small>APP</small> <time>10:52 AM</time></p>
                          <p>Trainer roster for <b>Enterprise AI basics</b>. Who should teach it?</p>
                          <div className="skList">
                            {trainers.map(t => (
                              <div key={t.id} className={`skRow${trainer === t.id ? ' isPicked' : ''}`}>
                                <div><p><b>{t.name}</b> · {t.city}</p><p className="skContext">{t.certified ? 'Certified' : 'Not certified'} · {t.load}/3 this week</p></div>
                                <button type="button" className="skBtn" onClick={() => pick(t)} disabled={stage > 1}>{trainer === t.id ? 'Selected' : 'Select'}</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>}
                      {nudge && <div className="skMsg isEphemeral rqIn" role="status"><b className="skAv isBot">{Icon.bolt}</b><div><p className="skOnly">{Icon.eye}Only visible to you</p><p className="skName">Request bot <small>APP</small></p><p>{nudge} Pick someone else.</p></div></div>}
                      {chosen && <div className="skMsg rqIn" role="status"><b className="skAv isBot">{Icon.bolt}</b><div><p className="skName">Request bot <small>APP</small> <time>10:53 AM</time></p><p>✅ {chosen.name} selected. Opening her calendar…</p></div></div>}
                    </>}
                  </>}
                </div>
                <div className="skComposer">
                  <span>Message #enablement-ops</span>
                  <div><i className="skPlus">+</i><i>Aa</i><i>☺</i><i>@</i><em>{Icon.send}</em></div>
                </div>
                <p className="skTyping">{typing ? <><i/><i/><i/><b>Customer team</b> is typing…</> : ' '}</p>
              </div>
            </div>
          </div>
        </article>

        {/* ---------- Google Calendar ---------- */}
        <article className={step(2)}>
          <header><b>{stage > 2 ? '✓' : '3'}</b><div><h3>{auto ? 'Times are checked in the trainer’s zone before anyone sees them.' : 'The match still had to work in the trainer’s local time.'}</h3></div></header>
          <div className="requestApp gcApp">
            <div className="gcTop">
              <span className="gcMenu" aria-hidden="true"><i/><i/><i/></span>
              <span className="gcLogo" aria-hidden="true"><em>31</em></span>
              <span className="gcWord">Calendar</span>
              <span className="gcToday">Today</span>
              <span className="gcArrows" aria-hidden="true">‹&nbsp;&nbsp;›</span>
              <span className="gcMonth">Sep 2026</span>
            </div>
            <div className="gcTabs">
              <span>Event details</span>
              <span className="isOn">Find a time</span>
              <span className="gcZone" role="group" aria-label="Time zone">
                <button type="button" aria-pressed={zone === 'et'} onClick={() => flipZone('et')} disabled={stage < 2}>New York</button>
                <button type="button" aria-pressed={zone === 'local'} onClick={() => flipZone('local')} disabled={stage < 2}>Berlin</button>
              </span>
            </div>
            {stage < 2 ? <p className="gcEmpty">{auto ? 'Waiting on a trainer match…' : 'Pick a trainer to see their week.'}</p> : <>
              <div className="gcGuests">
                <span><b className="isP">P</b>Priya S.</span><span><b className="isY">Y</b>You</span>
                {zone === 'local' && <em className="rqIn"><i/>Outside working hours</em>}
              </div>
              <div className="gcGrid">
                <span className="gcTz">{zone === 'et' ? 'GMT-04' : 'GMT+02'}</span>
                <b className="gcDay">MON<em>21</em></b><b className="gcDay">TUE<em>22</em></b><b className="gcDay">WED<em>23</em></b>
                {hours[zone].map((h, i) => <span key={h} className="gcHour" style={{gridRow: i + 2}}>{h}</span>)}
                {[0, 1, 2].map(c => <i key={c} className="gcLane" style={{gridColumn: c + 2}}/>)}
                {zone === 'local' && <i className="gcOff" title="Outside Priya’s working hours"/>}
                <i className="gcBusy" style={{gridColumn: 2, gridRow: 2}}>Team sync</i>
                {slots.map((s, i) => {
                  const isBooked = booked?.id === s.id;
                  const label = zone === 'et' ? s.et : s.local;
                  const pos = {gridColumn: s.col + 2, gridRow: s.row + 1};
                  if (isBooked) return <i key={s.id} className="gcEvent" style={pos}>Enterprise AI basics<small>{label}</small></i>;
                  if (stage === 3) return null;
                  return auto
                    ? <span key={s.id} className={`gcSlot${slotState(s, i)}`} style={pos}>{label}<small>{i < checked ? (s.ok ? 'In hours' : 'After hours') : 'Checking…'}</small></span>
                    : <button type="button" key={s.id} className={`gcSlot${slotState(s, i)}`} style={pos} onClick={() => book(s)}>{label}<small>Proposed</small></button>;
                })}
              </div>
              <div className="gcPanel">
                {stage === 3 ? <div className="rqBooked" role="status">
                  <b>Hold sent to Priya</b>
                  <span>{booked?.day} · {booked?.et} New York · {booked?.local} Berlin.</span>
                  {auto && (byHand
                    ? <span className="rqCompare">By hand you made <strong>{byHand.clicks} clicks</strong>{byHand.dead ? <> and hit <strong>{byHand.dead} dead {byHand.dead === 1 ? 'end' : 'ends'}</strong></> : null}. Automated: <strong>{tally.clicks}</strong>, both approvals.</span>
                    : <span className="rqCompare">Automated, you made <strong>{tally.clicks} clicks</strong>, both approvals.</span>)}
                  {auto
                    ? <button type="button" className="rqReplay" onClick={() => start('manual')}>Try it by hand ↻</button>
                    : <button type="button" className="rqBtn rqNext" onClick={() => start('auto')}>Now run it automated →</button>}
                </div> : auto
                  ? (checked >= slots.length
                    ? <div className="gcReview rqIn"><p><b>Review stop.</b> One time passes every rule. A person approves the hold.</p><button type="button" className="gcBtn" onClick={approve}>Approve hold</button></div>
                    : <p className="gcHint">Checking each proposed time against Priya’s working hours…</p>)
                  : miss
                    ? <p className="gcNudge" role="status">{miss}</p>
                    : <p className="gcHint">Click a proposed time to hold it for Priya.</p>}
              </div>
            </>}
          </div>
        </article>
      </div>
    </div>
  );
}
