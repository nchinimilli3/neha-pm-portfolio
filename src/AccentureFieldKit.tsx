import React from 'react';

export default function AccentureFieldKit(){
  return <div className="accentureDeliverables">
    <p className="deliverablesCaption">Deliverable summaries · illustrative excerpts, not original internal files</p>
    <div className="deliverablesGrid">
      <article className="deliverable">
        <header><span className="fileBadge docBadge">DOC</span><div><strong>Role guides & communication</strong><span>Make the next step clear</span></div></header>
        <div className="deliverablePaper">
          <span className="documentEyebrow">OPERATING GUIDE</span><h3>Who does what?</h3>
          <section><h4>Coordinator</h4><p>Clarify the request, check trainer fit, and confirm the handoff.</p></section>
          <section><h4>Trainer</h4><p>Confirm fit and availability, prepare the session, and close the loop.</p></section>
          <div className="documentNote">20 reusable communication scenarios support recurring coordination.</div>
        </div>
        <footer><b>Purpose</b> Make responsibilities and follow-up easier to repeat.</footer>
      </article>
      <article className="deliverable">
        <header><span className="fileBadge sheetBadge">XLS</span><div><strong>Automation decision contract</strong><span>Turn judgment into explicit rules</span></div></header>
        <div className="deliverableSheet">
          <div className="sheetFormula"><span>fx</span> Request inputs & matching checks</div>
          <table><thead><tr><th>Check</th><th>What needs to be defined</th></tr></thead><tbody>
            <tr><th>Inputs</th><td>Region, topic, timing</td></tr>
            <tr><th>Trainer fit</th><td>Expertise, language, capacity</td></tr>
            <tr><th>Scheduling</th><td>Time zone and working hours</td></tr>
            <tr><th>Exceptions</th><td>Warnings and human review</td></tr>
          </tbody></table><div className="sheetTabs"><b>Rules</b><span>Inputs</span><span>Review</span><small>10 tabs total</small></div>
        </div>
        <footer><b>Purpose</b> Define what automation can check and when a person must decide.</footer>
      </article>
      <article className="deliverable">
        <header><span className="fileBadge slideBadge">PPT</span><div><strong>Evidence & recommendations</strong><span>Explain what to test next</span></div></header>
        <div className="deliverableSlide"><span className="documentEyebrow">RECOMMENDATION SUMMARY</span><h3>From feedback<br/>to next steps</h3><dl><div><dt>Evidence</dt><dd>~2,200 learner responses</dd></div><div><dt>Focus</dt><dd>5 recommendations</dd></div><div><dt>Next phase</dt><dd>A 90-day test plan</dd></div></dl><span className="slidePage">9-slide internship story</span></div>
        <footer><b>Purpose</b> Give leadership a clear basis for choosing the next phase.</footer>
      </article>
    </div>
  </div>;
}
