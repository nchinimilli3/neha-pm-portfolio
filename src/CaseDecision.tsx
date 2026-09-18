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
   "The call" is the only row that links: it jumps to the DecisionMoment. */

/* One medallion per column, reading as a sentence: ! (the problem), -> (the
   call that moved it), ✓ (what came out). The call's medallion is solid
   accent and larger, so it doubles as the arc's apex marker. */
const arcIcons = {
  problem: <span className="cdArcMedal" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M12 6v7"/><circle cx="12" cy="17.2" r="1.3"/></svg>
  </span>,
  call: <span className="cdArcMedal cdArcMedalCall" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M4.5 12h14"/><path d="M13 6.5l5.5 5.5-5.5 5.5"/></svg>
  </span>,
  result: <span className="cdArcMedal" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M5.5 12.5l4 4 9-9"/></svg>
  </span>
};

export function CaseAnswer({
  problem,
  owned,
  call,
  callHref,
  evidence,
  result
}: {
  problem: Node;
  owned: Node;
  call: Node;
  callHref?: string;
  evidence: Node;
  result: Node;
}) {
  /* Not a list. A causal arc, drawn: the curve rises from the situation, peaks
     on the decision, and comes down on the outcome, so the shape itself says
     which of the three is the point. The evidence hangs under the apex. */
  return <section className="cdAnswer" aria-label="The short version of this case study">
    <header className="cdAnswerHead">
      <span className="cdAnswerRule" aria-hidden="true"/>
      <p className="cdAnswerKicker">The 20-second version</p>
      <span className="cdAnswerRule" aria-hidden="true"/>
    </header>

    <p className="cdAnswerRole"><b>What I owned</b><span>{owned}</span></p>

    <div className="cdArcVisual" aria-hidden="true">
      <svg viewBox="0 0 1000 86" preserveAspectRatio="none">
        <path className="cdArcCurve" d="M60 74C250 74 300 12 500 12S750 74 940 74"/>
      </svg>
      <i className="cdArcNode cdArcNodeStart"/>
      <i className="cdArcNode cdArcNodeEnd"/>
    </div>

    <div className="cdArc">
      <div className="cdArcCol cdArcSide">
        {arcIcons.problem}
        <b>The problem</b>
        <p>{problem}</p>
      </div>

      <div className="cdArcCol cdArcCall">
        {arcIcons.call}
        <b>The call</b>
        <p className="cdArcStatement">
          {callHref ? <a href={callHref}>{call}<i aria-hidden="true">↓</i></a> : call}
        </p>
        <p className="cdArcEvidence"><span>Because of</span>{evidence}</p>
      </div>

      <div className="cdArcCol cdArcSide">
        {arcIcons.result}
        <b>What happened</b>
        <p>{result}</p>
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
   because / tradeoff / result say what caused it and what it cost. Evidence
   that belongs to the decision goes in children so it reads as part of the
   moment rather than as the next section. */
export function DecisionMoment({
  id,
  kicker = 'The decision',
  statement,
  sub,
  because,
  tradeoff,
  result,
  children
}: {
  id?: string;
  kicker?: string;
  statement: Node;
  sub?: Node;
  because: Node;
  tradeoff: Node;
  result: Node;
  children?: Node;
}) {
  return <section className="cdMoment" id={id} aria-label="The consequential decision">
    <p className="cdMomentKicker">{kicker}</p>
    <p className="cdStatement">{statement}</p>
    {sub && <p className="cdMomentSub">{sub}</p>}
    <div className="cdMomentGrid">
      <div className="cdMomentCol"><b>Because</b><div>{because}</div></div>
      <div className="cdMomentCol"><b>What it cost</b><div>{tradeoff}</div></div>
      <div className="cdMomentCol"><b>So</b><div>{result}</div></div>
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
