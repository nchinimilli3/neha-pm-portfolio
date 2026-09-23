import React, {useEffect, useRef, useState} from 'react';

/* The request relay, played twice. First by hand: the visitor is the
   coordinator and hits the same two traps the real process had, a required
   field that arrives empty and a time that only looks fine in the requester's
   zone. Then the same request runs through the automation, which applies
   the rules and stops only where a person has to decide. The comparison counts
   the visitor's own clicks, so no number here is invented. People and times
   are illustrative. */

type Trainer = {id: string; name: string; city: string; initial: string; certified: boolean; load: number; note?: string; code?: string};
const trainers: Trainer[] = [
  {id: 'marcus', name: 'Marcus T.', city: 'London', initial: 'M', certified: true, load: 3, note: 'Already teaching 3 of 3 sessions this week.', code: 'At capacity'},
  {id: 'priya', name: 'Priya S.', city: 'Berlin', initial: 'P', certified: true, load: 1},
  {id: 'ana', name: 'Ana R.', city: 'Madrid', initial: 'A', certified: false, load: 0, note: 'Not certified to teach Enterprise AI basics yet.', code: 'Not certified'}
];

/* Berlin runs six hours ahead of New York. Priya works 9 AM to 5 PM. */
type Slot = {id: string; day: string; et: string; local: string; ok: boolean; why?: string; col: number; row: number};
const slots: Slot[] = [
  {id: 'tue1', day: 'Tue 15', et: '1:00 PM', local: '7:00 PM', ok: false, why: 'That is 7:00 PM in Berlin, after Priya’s working day.', col: 1, row: 3},
  {id: 'tue9', day: 'Tue 15', et: '9:00 AM', local: '3:00 PM', ok: true, col: 1, row: 1},
  {id: 'wed11', day: 'Wed 16', et: '11:00 AM', local: '5:00 PM', ok: false, why: 'It starts at 5:00 PM in Berlin, when Priya’s day ends.', col: 2, row: 2}
];
const good = slots.find(s => s.ok)!;

type Mode = 'manual' | 'auto';

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
  useEffect(() => { const el = feed.current; if (el) el.scrollTo({top: el.scrollHeight, behavior: 'smooth'}); }, [stage, asked, typing, region, shortlist, nudge, trainer]);

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

  const active = Math.min(stage, 2);
  const chosen = trainers.find(t => t.id === trainer);
  const booked = slots.find(s => s.id === slot);
  const step = (i: number) => `requestStep${active === i ? ' isActive' : ''}${stage > i ? ' isDone' : ''}${stage < i ? ' isLocked' : ''}`;

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
        <article className={step(0)}>
          <header><b>{stage > 0 ? '✓' : '1'}</b><div><h3>{auto ? 'The request is checked the moment it lands in Salesforce.' : 'Requests started in Salesforce with the basic session details.'}</h3></div></header>
          <div className="requestApp salesforceApp">
            <div className="requestAppChrome"><span className="salesforceCloud">☁</span><strong>Salesforce</strong><span>Service</span></div>
            <nav>Requests <span>›</span> #021</nav>
            <div className="requestAppBody">
              <span className="documentEyebrow">Training request</span>
              <h4>Enterprise AI basics</h4>
              <dl>
                <div><dt>Request owner</dt><dd>Customer team</dd></div>
                <div><dt>Timing</dt><dd>Next week</dd></div>
                <div><dt>Region</dt><dd className={region ? 'rqFilled' : 'requestWarning'}>{region ? 'EMEA · English' : 'Not provided'}{auto && !region && stage > 0 && <span className="rqCode">Missing required field</span>}</dd></div>
              </dl>
              {auto
                ? <p className={`rqStatus${stage === 0 ? ' isPending' : ''}`}>{stage === 0 ? 'Checking required fields…' : 'Routed to #enablement-ops with 1 flag'}</p>
                : stage === 0
                  ? <button type="button" className="rqBtn rqSf" onClick={submit}>Submit request</button>
                  : <p className="rqStatus">Sent to #enablement-ops</p>}
            </div>
          </div>
        </article>

        <article className={step(1)}>
          <header><b>{stage > 1 ? '✓' : '2'}</b><div><h3>{auto ? 'Matching rules shortlist trainers, each with a reason.' : 'A coordinator filled the gaps and reviewed which trainers fit.'}</h3></div></header>
          <div className="requestApp slackApp">
            <div className="requestAppChrome"><strong>Slack</strong><span>Enablement workspace</span></div>
            <nav># enablement-ops</nav>
            <div className="requestAppBody rqFeed" ref={feed}>
              {stage === 0 ? <p className="rqWaiting">Waiting for a new request…</p> : <>
                <div className="requestMessage rqIn">
                  <b className="botAvatar">B</b>
                  <div><strong>Request bot <small>APP</small></strong><p>New request #021</p>
                    <blockquote>Enterprise AI basics<br />Timing: next week<br /><b>Region: not provided</b></blockquote>
                  </div>
                </div>

                {auto ? <>
                  {!region
                    ? <div className="rqActions rqReview rqIn"><span><b>Review stop.</b> Region is required to match a trainer.</span><button type="button" className="rqBtn rqSlack" onClick={confirmRegion}>Confirm region: EMEA · English</button></div>
                    : <div className="requestMessage rqIn"><b className="humanAvatar">Y</b><div><strong>You</strong><p>Region confirmed: EMEA, English.</p></div></div>}
                  {shortlist && <div className="requestMessage rqIn"><b className="botAvatar">B</b><div><strong>Request bot <small>APP</small></strong><p>Checked 3 trainers for expertise, certification, and capacity.</p>
                    <div className="rqShortlist rqAutoList">
                      {trainers.map((t, i) => (
                        <div key={t.id} className={`rqTrainer rqIn${trainer === t.id ? ' isPicked' : ''}${t.code ? ' isOut' : ''}`} style={{animationDelay: `${i * 120}ms`}}>
                          <b>{t.initial}</b>
                          <span><strong>{t.name}</strong><small>{t.city}</small></span>
                          <em className={t.code ? 'no' : 'ok'}>{t.code ?? 'Match'}</em>
                        </div>
                      ))}
                    </div>
                    {chosen && <p className="rqStatus rqIn">{chosen.name} matched. Checking {chosen.city} working hours…</p>}
                  </div></div>}
                </> : <>
                  {!asked && <div className="rqActions"><span>No region, no trainer match.</span><button type="button" className="rqBtn rqSlack" onClick={ask}>Ask the requester for region</button></div>}
                  {asked && <div className="requestMessage rqIn"><b className="humanAvatar">Y</b><div><strong>You</strong><p>@customer-team which region and language is this for?</p></div></div>}
                  {typing && <p className="rqTyping"><i /><i /><i /> Customer team is typing</p>}
                  {region && <div className="requestMessage rqIn"><b className="rqCustAvatar">C</b><div><strong>Customer team</strong><p>EMEA, delivered in English.</p></div></div>}
                  {shortlist && <div className="rqShortlist rqIn">
                    <p>Who can teach it? Check certification and capacity.</p>
                    {trainers.map(t => (
                      <button type="button" key={t.id} className={`rqTrainer${trainer === t.id ? ' isPicked' : ''}`} onClick={() => pick(t)} disabled={stage > 1}>
                        <b>{t.initial}</b>
                        <span><strong>{t.name}</strong><small>{t.city}</small></span>
                        <em className={t.certified ? 'ok' : 'no'}>{t.certified ? 'Certified' : 'Not certified'}</em>
                        <em className={t.load < 3 ? 'ok' : 'no'}>{t.load}/3 this week</em>
                      </button>
                    ))}
                    {nudge && <p className="rqNudge" role="status">{nudge}</p>}
                    {chosen && <p className="rqStatus" role="status">{chosen.name} fits. Checking {chosen.city} time…</p>}
                  </div>}
                </>}
              </>}
            </div>
          </div>
        </article>

        <article className={step(2)}>
          <header><b>{stage > 2 ? '✓' : '3'}</b><div><h3>{auto ? 'Times are checked in the trainer’s zone before anyone sees them.' : 'The match still had to work in the trainer’s local time.'}</h3></div></header>
          <div className="requestApp calendarApp">
            <div className="requestAppChrome"><span className="calendarIcon">31</span><strong>Google Calendar</strong></div>
            <nav>
              {chosen ? `${chosen.name} · ${chosen.city}` : 'Trainer availability'}
              <span className="rqZone" role="group" aria-label="Time zone">
                <button type="button" aria-pressed={zone === 'et'} onClick={() => { if (!auto) click(); setZone('et'); }} disabled={stage < 2}>New York</button>
                <button type="button" aria-pressed={zone === 'local'} onClick={() => { if (!auto) click(); setZone('local'); }} disabled={stage < 2}>Berlin</button>
              </span>
            </nav>
            {stage < 2 ? <p className="rqWaiting rqCalWait">{auto ? 'Waiting on a trainer match…' : 'Pick a trainer to see their week.'}</p> : <>
              <div className="rqWeek" aria-hidden="true">
                <b>MON<em>14</em></b><b className="isToday">TUE<em>15</em></b><b>WED<em>16</em></b><i className="rqLane" /><i className="rqLane" /><i className="rqLane" />
                {booked && <i className="rqHold" style={{gridColumn: booked.col + 1, gridRow: `${booked.row + 1} / span 2`}}>Enterprise AI basics<small>{zone === 'et' ? `${booked.et} ET` : `${booked.local} Berlin`}</small></i>}
              </div>
              {stage === 2 ? <div className="rqSlots">
                <p>Proposed times, shown in {zone === 'et' ? 'the requester’s zone' : 'Priya’s zone'}:</p>
                {auto ? <>
                  {slots.map((s, i) => (
                    <div key={s.id} className={`rqSlot${i < checked ? (s.ok ? ' isPass' : ' isOff') : ' isChecking'}`}>
                      <span>{s.day}</span><strong>{zone === 'et' ? s.et : s.local}</strong><small>{i < checked ? (s.ok ? 'In hours' : 'After hours') : 'Checking…'}</small>
                    </div>
                  ))}
                  {checked >= slots.length && <div className="rqActions rqReview rqIn"><span><b>Review stop.</b> One time passes every rule. A person approves the hold.</span><button type="button" className="rqBtn rqCal" onClick={approve}>Approve hold</button></div>}
                </> : <>
                  {slots.map(s => (
                    <button type="button" key={s.id} className={`rqSlot${miss && zone === 'local' && !s.ok ? ' isOff' : ''}`} onClick={() => book(s)}>
                      <span>{s.day}</span><strong>{zone === 'et' ? s.et : s.local}</strong><small>1 hr</small>
                    </button>
                  ))}
                  {miss && <p className="rqNudge" role="status">{miss}</p>}
                </>}
              </div> : <div className="rqBooked" role="status">
                <b>Hold sent to Priya</b>
                <span>{booked?.day} · {booked?.et} New York · {booked?.local} Berlin.</span>
                {auto && (byHand
                  ? <span className="rqCompare">By hand you made <strong>{byHand.clicks} clicks</strong>{byHand.dead ? <> and hit <strong>{byHand.dead} dead {byHand.dead === 1 ? 'end' : 'ends'}</strong></> : null}. Automated: <strong>{tally.clicks}</strong>, both approvals.</span>
                  : <span className="rqCompare">Automated, you made <strong>{tally.clicks} clicks</strong>, both approvals.</span>)}
                {auto
                  ? <button type="button" className="rqReplay" onClick={() => start('manual')}>Try it by hand ↻</button>
                  : <button type="button" className="rqBtn rqNext" onClick={() => start('auto')}>Now run it automated →</button>}
              </div>}
            </>}
          </div>
        </article>
      </div>
    </div>
  );
}
