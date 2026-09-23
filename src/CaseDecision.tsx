import React from 'react';
import './case-decision.css';

/* Editorial primitives that rank a case study by the weight of its decisions
   instead of the order the content was written in.

   CaseAnswer   the 20-second read, above everything else
   DecisionMoment  the one consequential call, given more weight than any h2
   CausalChain  observation -> decision -> consequence, stated as a chain
   Supporting   implementation detail, deliberately quieter

   None of these draw a box. They rank with type scale, rules and space so the
   content keeps sitting on the case background. */

type Node = React.ReactNode;

/* The five answers a reviewer should have before deciding to keep scrolling.
   Read in the order it should be understood: the problem and evidence come
   first, then the decision it led to. "The product decision" is the only link: it jumps to
   the DecisionMoment. */

const icons = {
  call: <svg viewBox="0 0 24 24"><path d="M4.5 12h14"/><path d="M13 6.5l5.5 5.5-5.5 5.5"/></svg>,
  problem: <svg viewBox="0 0 24 24"><path d="M12 6v7"/><circle cx="12" cy="17.2" r="1.3"/></svg>,
  evidence: <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l4.5 4.5"/></svg>,
  result: <svg viewBox="0 0 24 24"><path d="M5.5 12.5l4 4 9-9"/></svg>,
  role: <svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2"/></svg>
};

/* Counts a stat like "+25%" or "~2.2K" up from zero once the block is on
   screen. Anything without a leading number, or too small to count ("<1 day"),
   is shown as written. */
export function CountUp({value, run}: {value: string; run: boolean}) {
  const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = React.useState(value);
  React.useEffect(() => {
    if (!run || !m || parseFloat(m[2].replace(/,/g, '')) < 3) return;
    const [, pre, raw, post] = m;
    const commas = raw.includes(',');
    const num = raw.replace(/,/g, '');
    const target = parseFloat(num);
    const decimals = (num.split('.')[1] || '').length;
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 1100);
      const eased = 1 - Math.pow(1 - k, 3);
      const n = (target * eased).toFixed(decimals);
      setShown(pre + (commas ? Number(n).toLocaleString('en-US') : n) + post);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);
  return <>{shown}</>;
}

export function CaseAnswer({
  problem,
  owned,
  call,
  callHref,
  evidence,
  result,
  stat
}: {
  problem: Node;
  owned: Node;
  call: Node;
  callHref?: string;
  evidence: Node;
  result: Node;
  stat?: {value: string; label: string};
}) {
  /* Visible by default. Only when JS runs and motion is allowed does the block
     arm itself (hidden start state) and play in once it scrolls into view, so
     the most important block on the page never depends on an animation. */
  const ref = React.useRef<HTMLElement>(null);
  const [phase, setPhase] = React.useState<'static' | 'armed' | 'in'>('static');
  React.useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPhase('armed');
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setPhase('in'); io.disconnect(); }
    }, {threshold: .25});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* A plain-string call rises in word by word. */
  const split = typeof call === 'string' ? call.split(' ') : null;
  const words = split
    ? split.map((w, i) => <span key={i} className="cdWord" style={{'--w': i} as React.CSSProperties}>{w} </span>)
    : call;

  const rows: {key: keyof typeof icons; body: Node}[] = [
    {key: 'problem', body: <><b>Problem</b><p>{problem}</p></>},
    {key: 'evidence', body: <><b>Evidence</b><p>{evidence}</p></>},
    {key: 'result', body: <><b>Result</b>
      {stat && <p className="cdStat"><strong><CountUp value={stat.value} run={phase === 'in'}/></strong><span>{stat.label}</span></p>}
      <p>{result}</p>
    </>}
  ];

  return <section ref={ref} className={`cdAnswer${phase === 'static' ? '' : ' isArmed'}${phase === 'in' ? ' isIn' : ''}`} aria-label="The short version of this case study">
    <div className="cdAnswerBody">
      <ol className="cdTimeline">
        {rows.map((row, i) => <li key={row.key} className={`cdRow cdRow-${row.key}`} style={{'--r': i} as React.CSSProperties}>
          <span className="cdMedal" aria-hidden="true">{icons[row.key]}</span>
          <div className="cdRowText">{row.body}</div>
        </li>)}
      </ol>

      <div className="cdCall">
        <p className="cdCallLabel"><span className="cdMedal cdMedalCall" aria-hidden="true">{icons.call}</span>The decision</p>
        {/* --n lets the underline and arrow wait until the last word has landed. */}
        <p className="cdCallStatement" style={{'--n': split ? split.length : 1} as React.CSSProperties}>
          {callHref ? <a href={callHref} onClick={e => {
            // The site routes on the URL hash, so a plain #anchor would leave the case study.
            const target = document.getElementById(callHref.slice(1));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({behavior: 'smooth', block: 'start'});
          }}>{words}<i aria-hidden="true">↓</i></a> : words}
        </p>
        <p className="cdRole"><span className="cdRoleIcon" aria-hidden="true">{icons.role}</span><span><b>My role</b>{owned}</span></p>
      </div>

    </div>
  </section>;
}

/* observation -> insight -> decision -> tradeoff -> result, as an explicit
   chain. Mark one step `emphasis` to make it the pivot. */
export function CausalChain({
  steps,
  className = ''
}: {
  steps: { label: string; text: Node; emphasis?: boolean }[];
  className?: string;
}) {
  return <ol className={`cdChain ${className}`}>
    {steps.map(step => <li key={step.label} className={step.emphasis ? 'isPivot' : ''}>
      <b>{step.label}</b><span>{step.text}</span>
    </li>)}
  </ol>;
}

/* The page's loudest element. `statement` is the decision in one sentence;
   because / tradeoff / result follow it in that order, each with a small
   label so a skimmer can read the three columns without the prose. Evidence
   that belongs to the decision goes in children so it reads as part of the
   moment rather than as the next section. */
export function DecisionMoment({
  id,
  statement,
  sub,
  because,
  tradeoff,
  result,
  children
}: {
  id?: string;
  statement: Node;
  sub?: Node;
  because: Node;
  tradeoff: Node;
  result: Node;
  children?: Node;
}) {
  // Reveal the block in reading order: statement, then the three columns, then the evidence.
  const ref = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const n = ref.current;
    if (!n) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, {threshold: .15});
    io.observe(n);
    return () => io.disconnect();
  }, []);
  return <section ref={ref} className={`cdMoment${shown ? ' isShown' : ''}`} id={id} aria-label="The consequential decision">
    <p className="cdStatement">{statement}</p>
    {sub && <p className="cdMomentSub">{sub}</p>}
    <div className="cdMomentGrid">
      <div className="cdMomentCol"><b>Why</b><div>{because}</div></div>
      <div className="cdMomentCol"><b>Tradeoff</b><div>{tradeoff}</div></div>
      <div className="cdMomentCol"><b>Outcome</b><div>{result}</div></div>
    </div>
    {children && <div className="cdMomentEvidence">{children}</div>}
  </section>;
}

/* What was given up, next to what it bought. Reads as a visual ledger rather
   than another paragraph, so the "what it cost" column stays scannable. */
export function Tradeoff({pairs}: {pairs: [Node, Node][]}) {
  return <ul className="cdTradeoff">
    {pairs.map((pair, i) => <li key={i}>
      <s>{pair[0]}</s><i aria-hidden="true">↓</i><b>{pair[1]}</b>
    </li>)}
  </ul>;
}

/* Evidence and implementation detail: kept in full, ranked below the decision
   it supports. */
export function Supporting({
  title,
  note,
  children
}: {
  title: string;
  note?: Node;
  children: Node;
}) {
  return <section className="cdSupporting">
    <header><p className="cdSupportingTitle">{title}</p>{note && <p className="cdSupportingNote">{note}</p>}</header>
    <div className="cdSupportingBody">{children}</div>
  </section>;
}

/* ---- Case system components ------------------------------------------
   Every chapter of a case study is one CaseChapter: the same header (eyebrow,
   title, optional lead) on the same left edge, over a body whose layout is
   free to change. Variety comes from the body, never from moving the header,
   so a reader scanning down the left edge always finds the next chapter.
   The eyebrow ("02 · Define") is stamped by LifecycleRoad from its stage list. */
export function CaseChapter({
  id,
  title,
  lead,
  className = '',
  children
}: {
  id?: string;
  title: Node;
  lead?: Node;
  className?: string;
  children: Node;
}) {
  return <section id={id} className={`csChapter ${className}`}>
    <header className="csHead"><h2>{title}</h2>{lead && <p className="csLead">{lead}</p>}</header>
    <div className="csBody">{children}</div>
  </section>;
}

/* A pull quote: one line at display size with a chapter of space on both
   sides, the page's breath between two dense chapters. Left edge, accent rule
   above, the same on every case. */
export function CasePull({children}: {children: Node}) {
  const ref = React.useRef<HTMLElement>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const n = ref.current;
    if (!n || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, {threshold: .4});
    io.observe(n);
    return () => io.disconnect();
  }, []);
  return <section ref={ref} className={`csPullQuote${seen ? ' isIn' : ''}`}><p>{children}</p></section>;
}

/* The results beat: the outcome numbers at full size with room around them.
   Values come from the case's metric list, so the page cannot drift from it. */
export function CaseResults({items, note}: {items: [string, string, string?][]; note?: Node}) {
  const ref = React.useRef<HTMLElement>(null);
  const [run, setRun] = React.useState(false);
  React.useEffect(() => {
    const n = ref.current;
    if (!n || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRun(true); io.disconnect(); } }, {threshold: .4});
    io.observe(n);
    return () => io.disconnect();
  }, []);
  return <section ref={ref} className="csChapter csResults" aria-labelledby="cs-results-title">
    <header className="csHead"><h2 id="cs-results-title" data-eyebrow="Outcome">Results</h2></header>
    <div className="csBody">
      <dl className="csStats">{items.map(([value, label]) => <div key={label}><dt>{label}</dt><dd><CountUp value={value} run={run}/></dd></div>)}</dl>
      {note && <p className="csResultsNote">{note}</p>}
    </div>
  </section>;
}
