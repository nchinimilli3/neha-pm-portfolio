import React from 'react';
import './accenture-v2.css';

/* UI north star: OpenAI Canvas official launch — https://openai.com/index/introducing-canvas/ */
export default function AccentureOpsWorkbench(){
  return <div className="aiOpsWorkbench" role="img" aria-label="A realistic ChatGPT and Canvas workspace structuring an enablement request and flagging a working-hours conflict for human review">
    <header className="aiOpsBar"><span className="aiOpsDots" aria-hidden="true"><i/><i/><i/></span><b className="aiOpsOpenMark">◉</b><strong>ChatGPT</strong><span className="aiOpsModel">4o⌄</span><em>Share</em><b className="aiOpsAvatar">NC</b></header>
    <div className="aiOpsCanvas">
      <aside className="aiOpsPrompt"><span>ENABLEMENT OPS</span><div className="aiOpsUserMessage">Structure request #021. Identify missing inputs and flag constraints before matching.</div><div className="aiOpsAssistant"><b>◉</b><p>I found two inputs that need clarification:</p><ul><li><strong>Region</strong><span>Missing</span></li><li><strong>Timing</strong><span>“Next week”</span></li></ul><small>I opened a structured draft in Canvas.</small></div><p>Open in Canvas <i aria-hidden="true">↗</i></p></aside>
      <section className="aiOpsDecision"><div className="aiOpsDecisionHead"><span>CANVAS · ENABLEMENT REQUEST #021</span><b>Editing</b></div><h3>AI enablement session</h3><dl className="aiOpsCanvasFields"><div><dt>Topic</dt><dd>Enterprise AI basics</dd><b>✓</b></div><div><dt>Region</dt><dd>Add region</dd><b>!</b></div><div><dt>Timing</dt><dd>Next week</dd><b>?</b></div></dl><div className="aiOpsRail"><article><small>01</small><strong>Validate inputs</strong></article><i/><article><small>02</small><strong>Match constraints</strong></article><i/><article><small>03</small><strong>Human review</strong></article><b className="aiOpsDataDot" aria-hidden="true"/></div><div className="aiOpsConflict"><span>EDGE CASE</span><strong>10:30 PM</strong><p>Working-hours conflict</p><b>REVIEW</b></div><footer>Portfolio reconstruction using sample data.</footer></section>
    </div><span className="aiOpsScan" aria-hidden="true"/>
  </div>
}
